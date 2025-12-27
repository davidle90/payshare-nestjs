import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group-dto';

@Controller('groups')
export class GroupsController {
    constructor(
        private groupsService: GroupsService
    ) {}

    @Get()
    findAll() {
        return this.groupsService.findAll();
    }

    @Get(':id')
    findOne(@Param() id: string) {
        const group = this.groupsService.findOne(id);

        if(!group) {
            throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
        }

        return group;
    }

    @Post()
    create(@Body(ValidationPipe) input: CreateGroupDto) {
        return this.groupsService.create(input)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body(ValidationPipe) input: CreateGroupDto) {
        return this.groupsService.update(id, input)
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.groupsService.delete(id);
    }
}
