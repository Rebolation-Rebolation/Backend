import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../../types/prisma.types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar novo usuário' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // TODO: Implementar lógica de recuperação de senha
    return { message: 'Email de recuperação enviado' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Redefinir senha' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // TODO: Implementar lógica de reset de senha
    return { message: 'Senha redefinida com sucesso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário logado' })
  async getMe(@CurrentUser() user: User) {
    const { password, ...result } = user;
    return result;
  }
}

