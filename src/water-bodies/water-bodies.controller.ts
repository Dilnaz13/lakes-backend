import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { WaterBodiesService } from './water-bodies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateWaterBodyDto, UpdateWaterBodyDto } from './dto/water-body.dto';
import { CreateMeasurementDto } from './dto/measurement.dto';
import { Patch } from '@nestjs/common';


@Controller('water-bodies')
export class WaterBodiesController {
    constructor(private readonly waterBodiesService: WaterBodiesService) {}

    // Публичный доступ (или можно закрыть JwtAuthGuard, если нужно только для авторизованных)
    @Get()
    findAll() {
        return this.waterBodiesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.waterBodiesService.findOne(id);
    }

    // Только для администраторов
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    create(@Body() createData: CreateWaterBodyDto) {
        return this.waterBodiesService.create(createData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: UpdateWaterBodyDto) {
        return this.waterBodiesService.update(id, updateData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id:string) {
        return this.waterBodiesService.remove(id);
    }

    // --- ЭНДПОИНТЫ ДЛЯ ЗАМЕРОВ (BioIndicationRecord) ---

    // Получить все замеры для конкретного озера (публичный или защищенный - на ваш выбор)
    @Get(':id/measurements')
    getMeasurements(@Param('id') id: string) {
        return this.waterBodiesService.getMeasurements(id);
    }

    // Добавить новый замер для озера (только для администраторов)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post(':id/measurements')
    addMeasurement(@Param('id') id: string, @Body() measurementData: CreateMeasurementDto) {
        return this.waterBodiesService.addMeasurement(id, measurementData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Put(':id/passport')
    updatePassport(
        @Param('id') id: string,
        @Body() passportData: any,
    ) {
        return this.waterBodiesService.upsertPassport(id, passportData);
    }
}
