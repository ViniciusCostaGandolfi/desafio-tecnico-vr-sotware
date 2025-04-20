import { Controller, Post, Get, Delete, Body, Param, ParseIntPipe, Patch, HttpCode } from '@nestjs/common';
import { ProdutoLojaService } from '../service/produto-loja.service';
import { CreateProdutoLojaDto } from '../dto/create-produto-loja.dto';
import { ProdutoLojaMapper } from '../mapper/produto-loja.mapper';
import { ProdutoLojaDto } from '../dto/produto-loja.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { UpdateProdutoLojaDto } from '../dto/update-produto-loja.dto';

@ApiTags('Produto × Loja')
@Controller('produtos-lojas')
export class ProdutoLojaController {
  constructor(private readonly service: ProdutoLojaService) {}

  @Post()
  @ApiCreatedResponse({ type: ProdutoLojaDto })
  async create(@Body() dto: CreateProdutoLojaDto): Promise<ProdutoLojaDto> {
    const preco = await this.service.create(dto);
    return ProdutoLojaMapper.toProdutoLojaDto(preco);
  }

  @Get(':id')
  @ApiOkResponse({ type: ProdutoLojaDto })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ProdutoLojaDto> {
    return ProdutoLojaMapper.toProdutoLojaDto(await this.service.findOne(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: ProdutoLojaDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProdutoLojaDto,
  ): Promise<ProdutoLojaDto> {
    const updated = await this.service.update(id, dto);
    return ProdutoLojaMapper.toProdutoLojaDto(updated);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }


}
