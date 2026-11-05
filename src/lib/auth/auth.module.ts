import { Global, Module } from "@nestjs/common";
import { AuthModule as BetterAuthNestModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth.js";

@Global()
@Module({
  imports: [BetterAuthNestModule.forRoot({ auth })],
  exports: [BetterAuthNestModule],
})
export class AuthModule {}
