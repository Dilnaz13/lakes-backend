import { Module } from '@nestjs/common';
import { WaterBodiesService } from './water-bodies.service';
import { WaterBodiesController } from './water-bodies.controller';
import { MeasurementsController } from '../measurements/measurements.controller';

@Module({
  providers: [WaterBodiesService],
  controllers: [WaterBodiesController, MeasurementsController]
})
export class WaterBodiesModule {}
