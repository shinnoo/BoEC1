import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'customer',
        data: { pageTitle: 'Customers' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'fullname',
        data: { pageTitle: 'Fullnames' },
        loadChildren: () => import('./fullname/fullname.module').then(m => m.FullnameModule),
      },
      {
        path: 'address',
        data: { pageTitle: 'Addresses' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'orders',
        data: { pageTitle: 'Orders' },
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
      },
      {
        path: 'cart',
        data: { pageTitle: 'Carts' },
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'Payments' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      {
        path: 'item',
        data: { pageTitle: 'Items' },
        loadChildren: () => import('./item/item.module').then(m => m.ItemModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
