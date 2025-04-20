import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { ApiTags, ApiNoContentResponse, ApiQuery } from '@nestjs/swagger';
import { ProdutoService } from '../service/produto.service';

import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ProdutoMapper } from '../mapper/product.mapper';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ProdutoFilterDto } from '../dto/produto-filter.dto';
import { ProdutoDto } from '../dto/produto.dto';
import { ProdutoLojaDto } from '../../produto-loja/dto/produto-loja.dto';
import { ProdutoLojaMapper } from '../../produto-loja/mapper/produto-loja.mapper';

@ApiTags('Produtos')
@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @ApiCreatedResponse({ description: 'Produto criado com sucesso', type: ProdutoDto })
  @Post()
  async create(@Body() dto: CreateProdutoDto): Promise<ProdutoDto> {
    const produto = await this.produtoService.create(dto);
    return ProdutoMapper.toProdutoDto(produto);
  }

  @ApiOkResponse({
    description: 'Lista todos os produtos com paginação',
    type: PaginationDto<ProdutoDto>,
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @Get()
  async findAll(
    @Query() filtro?: ProdutoFilterDto,
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
  ): Promise<PaginationDto<ProdutoDto>> {
    const paginated = await this.produtoService.findAll(filtro, page, pageSize);
    return {
      ...paginated,
      data: paginated.data.map(ProdutoMapper.toProdutoDto),
    };
  }


  @Get(':id/precos')
  @ApiOkResponse({
    description: 'Lista todos os preços de um produto',
    type: [ProdutoLojaDto],
  })
  async findAllPrecosByProductId(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ProdutoLojaDto[]> {
    const precos = await this.produtoService.findPrecosByProdutoId(id);
    return precos.map(ProdutoLojaMapper.toPrecoProdutoDto);
  }


  @Get(':id')
  @ApiOkResponse({ description: 'Retorna o produto com base no ID', type: ProdutoDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProdutoDto> {
    const produto = await this.produtoService.findOne(id);
    return ProdutoMapper.toProdutoDto(produto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Atualiza um produto existente', type: ProdutoDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProdutoDto,
  ): Promise<ProdutoDto> {
    const produto = await this.produtoService.update(id, dto);
    return ProdutoMapper.toProdutoDto(produto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Produto removido com sucesso' })
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.produtoService.remove(id);
  }
}
