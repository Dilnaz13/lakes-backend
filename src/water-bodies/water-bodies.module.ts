import { Module } from '@nestjs/common';
import { WaterBodiesService } from './water-bodies.service';
import { WaterBodiesController } from './water-bodies.controller';

@Module({
  providers: [WaterBodiesService],
  controllers: [WaterBodiesController]
})
export class WaterBodiesModule {}
