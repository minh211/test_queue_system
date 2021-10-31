import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PatientSchema {
  @Field((_type) => String)
  id: string;

  @Field((_type) => String)
  firstName: string;

  @Field((_type) => String)
  lastName: string;

  @Field((_type) => String)
  gender?: string;

  @Field((_type) => Date)
  birthday?: Date;

  @Field((_type) => String)
  caseDescription?: string;
}
