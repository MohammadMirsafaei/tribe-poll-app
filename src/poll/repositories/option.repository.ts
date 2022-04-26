import { EntityRepository, Repository } from 'typeorm';
import { Option } from '../entities/option.entity';
import { Poll } from '../entities/poll.entity';
import { OptionInput } from '../inputs/option.input';

@EntityRepository(Option)
export class OptionRepository extends Repository<Option> { }
