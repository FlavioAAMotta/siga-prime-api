
import { v7 as uuidv7 } from "uuid";

export class IdGenerator {
    public generate(): string {
        return uuidv7();
    }
}
