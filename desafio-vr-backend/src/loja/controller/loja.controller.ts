import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
import { LojaService } from '../service/loja.service';
import { CreateLojaDto } from '../dto/create-loja.dto';
import { UpdateLojaDto } from '../dto/update-loja.dto';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LojaMapper } from '../mapper/loja.mapper';
import { LojaDto } from '../dto/loja.dto';


@ApiTags('Lojas')
@Controller('lojas')
export class LojaController {
  constructor(private readonly service: LojaService) {}

  @Post()
  @ApiCreatedResponse({ type: LojaDto })
  async create(@Body() dto: CreateLojaDto): Promise<LojaDto> {
    return LojaMapper.toLojaDto(await this.service.create(dto));
  }

  @Get()
  @ApiOkResponse({ type: LojaDto })
  async findAll(): Promise<LojaDto[]> {
    const lojas = await this.service.findAll();
    return lojas.map(LojaMapper.toLojaDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: LojaDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<LojaDto> {
    return LojaMapper.toLojaDto(await this.service.findOne(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: LojaDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLojaDto,
  ): Promise<LojaDto> {
    return LojaMapper.toLojaDto(await this.service.update(id, dto));
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
