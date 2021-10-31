import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class DoctorSchema {
  @Field((_type) => String)
  id: string;

  @Field((_type) => String)
  firstName: string;

  @Field((_type) => String)
  lastName: string;

  @Field((_type) => Boolean)
  onDuty: boolean;
}

@InputType()
export class AddDoctorInput implements Partial<DoctorSchema> {
  @Field((_type) => String)
  firstName: string;
  @Field((_type) => String)
  lastName: string;
  @Field((_type) => Boolean)
  onDuty: boolean;
}
