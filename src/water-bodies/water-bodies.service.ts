import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaterBodyDto, UpdateWaterBodyDto } from './dto/water-body.dto';
import { CreateMeasurementDto } from './dto/measurement.dto';

@Injectable()
export class WaterBodiesService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.waterBody.findMany({
            include: {
                passport: true,
                measurements: true
            },
        });
    }

    async findOne(id: string) {
        const waterBody = await this.prisma.waterBody.findUnique({
            where: { id },
            include: {
                passport: true,
                measurements: {
                    orderBy: { recordDate: 'desc' },
                },
            },
        });

        if (!waterBody) {
            throw new NotFoundException(`Водоем с ID ${id} не найден`);
        }

        return waterBody;
    }

    async create(data: CreateWaterBodyDto) {
        const { passport, ...waterBodyData } = data;
        
        return this.prisma.waterBody.create({
            data: {
                ...waterBodyData,
                passport: passport ? { create: passport }: undefined,
            },
            include: {
                passport: true,
                measurements: true,
            }
        });
    }

    async update(id: string, data: UpdateWaterBodyDto) {
        const { passport, ...waterBodyData} = data;
        
        return this.prisma.waterBody.update({
            where: { id },
            data: {
                ...waterBodyData,
                passport: passport ? {
                    upsert: {
                        create: passport,
                        update: passport,
                    }
                } : undefined,
            },
            include: {
                passport: true,
            }
        });
    }

    async remove(id: string) {
        return this.prisma.waterBody.delete({
            where: { id },
        });
    }

    async addMeasurement(waterBodyId: string, data: CreateMeasurementDto) {
        // проверяем, существует ли водоем
        const waterBody = await this.prisma.waterBody.findUnique({ where: { id: waterBodyId } });
        if (!waterBody) {
            throw new NotFoundException(`Водоем с ID ${waterBodyId} не найден`);
        }

        return this.prisma.bioIndicationRecord.create({
            data: {
                ...data,
                waterBodyId,
            },
        });
    }

    async getMeasurements(waterBodyId: string) {
        return this.prisma.bioIndicationRecord.findMany({
            where: { waterBodyId },
            orderBy: { recordDate: 'desc' },
        });
    }

    async updateMeasurement(id: string, data: CreateMeasurementDto) {
        const measurement = await this.prisma.bioIndicationRecord.findUnique({
            where: { id },
        });
    
        if (!measurement) {
            throw new NotFoundException(`Замер с ID ${id} не найден`);
        }
        
        return this.prisma.bioIndicationRecord.update({
            where: { id },
            data: {
                ...data,
                recordDate: data.recordDate ? new Date(data.recordDate) : undefined,
            },
        });
    }

    async removeMeasurement(id: string) {
        const measurement = await this.prisma.bioIndicationRecord.findUnique({
            where: { id },
        });
        
        if (!measurement) {
            throw new NotFoundException(`Замер с ID ${id} не найден`);
        }
        
        return this.prisma.bioIndicationRecord.delete({
            where: { id },
        });
    }

    upsertPassport(waterBodyId: string, dto: any) {
        return this.prisma.waterBodyPassport.upsert({
             where: { waterBodyId },
             update: dto,
             create: { ...dto, waterBodyId },
            });
    }
}