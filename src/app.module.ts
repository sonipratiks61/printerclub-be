import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtRefreshTokenStrategy } from './auth/jwt-refresh.strategy';
import { MailService } from './mail/mail.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AttachmentService } from './attachment/attachment.service';
import { AttachmentController } from './attachment/attachment.controller';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadMiddleware } from 'utils/ImageUploadFunction/ImageUploadFunction';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/address.service';
import { GeoLocationController } from './geolocation/geolocation.controller';
import { GeoLocationService } from './geolocation/geolocation.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { RoleAndCapabilityController } from './role-and-capability/role-and-capability.controller';
import { RoleAndCapabilityService } from './role-and-capability/role-and-capability.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { ResponseService } from 'utils/response/customResponse';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { AttributeService } from './attribute/attribute.service';
import { AttributeController } from './attribute/attribute.controller';
import { ProductAttributesService } from './product-attributes/product-attributes.service';
import { ProductAttributesController } from './product-attributes/product-attributes.controller';
import { SubCategoryController } from './sub-category/sub-category.controller';
import { SubCategoryService } from './sub-category/sub-category.service';
import { ConfigModule } from '@nestjs/config';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { OrderHistoryController } from './order-history/order-history.controller';
import { OrderHistoryService } from './order-history/order-history.service';
import { OrderItemsService } from './order-items/order-items.service';
import { OrderItemsController } from './order-items/order-items.controller';
import { CustomerDetailsService } from './customer-details/customer-details.service';
import { CustomerDetailsController } from './customer-details/customer-details.controller';
import { OrderStatusController } from './order-status/order-status.controller';
import { OrderStatusService } from './order-status/order-status.service';
import { CapabilityController } from './capabilities/capability.controller';
import { CapabilityService } from './capabilities/capability.service';
import { CustomerOrderInvoiceService } from './order/orderInvoice/orderCustomerInvoice.service';
import { WorkFlowController } from './work-flow/work-flow.controller';
import { WorkFlowService } from './work-flow/work-flow.service';
@Module({
  imports: [
    JwtModule.register({}),
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot()
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    AttachmentController,
    AddressController,
    GeoLocationController,
    RoleController,
    RoleAndCapabilityController,
    CategoryController,
    ProductController,
    AttributeController,
    ProductAttributesController,
    SubCategoryController,
    OrderController,
    OrderHistoryController,
    CustomerDetailsController,
    OrderItemsController,
    OrderStatusController,
    CapabilityController,
    RoleAndCapabilityController,
    WorkFlowController
  ],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    JwtRefreshTokenStrategy,
    MailService,
    JwtStrategy,
    UserService,
    AttachmentService,
    AddressService,
    GeoLocationService,
    RoleService,
    RoleAndCapabilityService,
    CategoryService,
    ResponseService,
    ProductService,
    AttributeService,
    ProductAttributesService,
    SubCategoryService,
    CapabilityService,
    OrderService,
    OrderItemsService,
    CustomerDetailsService,
    OrderHistoryService,
    OrderStatusService,
    CustomerOrderInvoiceService,
    CapabilityService,
    RoleAndCapabilityController,
    WorkFlowService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FileUploadMiddleware).forRoutes('attachments');
  }
}
