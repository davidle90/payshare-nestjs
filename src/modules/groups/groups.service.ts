import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group-dto';

@Injectable()
export class GroupsService {
    constructor(private readonly groupRepository: Repository<Group>) {}

    findAll(sort: 'asc' | 'desc' = 'desc') {
        return this.groupRepository.find({
            order: { name: sort.toUpperCase() as 'ASC' | 'DESC' },
        });
    }

    findOne(id: string) {
        return this.groupRepository.findOne({ where: { id }});
    }

    create(input: CreateGroupDto) {
        const group = this.groupRepository.create(input);
        return this.groupRepository.save(group);
    }

    update(id: string, input: CreateGroupDto) {
        return this.groupRepository.update(id, input);
    }

    delete(id: string) {
        return this.groupRepository.delete(id);
    }
}
