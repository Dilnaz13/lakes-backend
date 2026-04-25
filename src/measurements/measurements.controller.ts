import { Body, Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WaterBodiesService } from '../water-bodies/water-bodies.service';

@Controller('measurements')
@UseGuards(JwtAuthGuard)
export class MeasurementsController {
  constructor(private readonly waterBodiesService: WaterBodiesService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.waterBodiesService.updateMeasurement(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waterBodiesService.removeMeasurement(id);
  }
}