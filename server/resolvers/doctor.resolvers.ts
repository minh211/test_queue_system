import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { DoctorsServices } from "../services";
import { AddDoctorInput, DoctorSchema } from "../schema";

@Resolver()
export class DoctorResolver {
  @Query((_returns) => [DoctorSchema], { nullable: true })
  async getDoctors() {
    return await DoctorsServices.getAllDoctor();
  }

  @Mutation((_returns) => DoctorSchema)
  async addDoctor(@Arg("data", (_returns) => AddDoctorInput) doctor: AddDoctorInput): Promise<DoctorSchema> {
    return await DoctorsServices.addDoctor(doctor);
  }
}
