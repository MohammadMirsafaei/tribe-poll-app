import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SignupInput } from '../inputs/signup.input';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(signupInput: SignupInput): Promise<User> {
    const { email, password, networkId } = signupInput;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ email, password: hashedPassword, networkId });
    console.log(user);
    return this.save(user);
  }
}
