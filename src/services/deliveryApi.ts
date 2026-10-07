import { Order, TrackingDetails, TrackingCheckpoint } from '../types';

export function normalizeOrderId(id: string): string {
  const cleaned = id.trim().toUpperCase().replace(/\s+/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('#IS-')) return cleaned;
  if (cleaned.startsWith('IS-')) return `#${cleaned}`;
  if (cleaned.startsWith('IS')) return `#IS-${cleaned.slice(2).replace(/^-/, '')}`;
  return `#IS-${cleaned.replace(/^#/, '')}`;
}

function statusFor(order: Order): Pick<TrackingDetails, 'status' | 'statusCode' | 'progressPercent' | 'estimatedDelivery'> {
  switch (order.status) {
    case 'Delivered':
      return { status: 'Delivered', statusCode: 'delivered', progressPercent: 100, estimatedDelivery: 'Delivered' };
    case 'Shipped':
      return { status: 'In Transit', statusCode: 'in_transit', progressPercent: 65, estimatedDelivery: 'In transit — delivery estimate pending courier update' };
    case 'Cancelled':
      return { status: 'Cancelled', statusCode: 'cancelled', progressPercent: 0, estimatedDelivery: 'Order cancelled' };
    case 'Pending Verification':
      return { status: 'Processing', statusCode: 'processing', progressPercent: 15, estimatedDelivery: 'Awaiting order/payment verification' };
    default:
      return { status: 'Processing', statusCode: 'processing', progressPercent: 30, estimatedDelivery: 'Preparing for dispatch' };
  }
}

function checkpointsFor(order: Order): TrackingCheckpoint[] {
  const delivered = order.status === 'Delivered';
  const shipped = order.status === 'Shipped' || delivered;
  const cancelled = order.status === 'Cancelled';

  if (cancelled) {
    return [
      {
        id: 'placed',
        title: 'Order placed',
        location: 'Insight Store',
        timestamp: order.date,
        completed: true,
        description: 'The order was recorded.',
      },
      {
        id: 'cancelled',
        title: 'Order cancelled',
        location: 'Insight Store',
        timestamp: order.date,
        completed: true,
        current: true,
        description: 'The order was cancelled.',
      },
    ];
  }

  return [
    {
      id: 'placed',
      title: 'Order placed',
      location: 'Insight Store',
      timestamp: order.date,
      completed: true,
      description: 'The order was recorded successfully.',
    },
    {
      id: 'processing',
      title: 'Order processing',
      location: 'Insight Store',
      timestamp: order.date,
      completed: true,
      current: !shipped,
      description: shipped ? 'Order preparation completed.' : 'The order is being prepared.',
    },
    {
      id: 'shipped',
      title: 'Dispatched',
      location: order.customer.city,
      timestamp: shipped ? 'Dispatch recorded' : 'Pending',
      completed: shipped,
      current: shipped && !delivered,
      description: shipped ? 'The order has been marked as dispatched.' : 'Courier dispatch has not been recorded yet.',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      location: order.customer.city,
      timestamp: delivered ? 'Delivery recorded' : 'Pending',
      completed: delivered,
      current: delivered,
      description: delivered ? 'The order has been marked as delivered.' : 'Delivery has not been completed yet.',
    },
  ];
}

export async function fetchTrackingStatus(
  inputOrderId: string,
  userOrders: Order[] = []
): Promise<TrackingDetails> {
  const cleanId = normalizeOrderId(inputOrderId);
  if (!cleanId || cleanId.length < 5) {
    throw new Error('Please enter a valid Insight Store order ID.');
  }

  const order = userOrders.find((item) => normalizeOrderId(item.id) === cleanId);
  if (!order) {
    throw new Error('Order not found in this account. Sign in with the account used for the purchase and check the order number.');
  }

  const state = statusFor(order);
  return {
    orderId: order.id,
    carrier: order.status === 'Shipped' || order.status === 'Delivered' ? 'Courier details pending sync' : 'Not assigned yet',
    trackingNumber: 'Not available yet',
    ...state,
    origin: 'Insight Store',
    destination: `${order.customer.address}, ${order.customer.city}`,
    recipientName: order.customer.fullName,
    recipientPhone: order.customer.phone,
    recipientAddress: order.customer.address,
    recipientCity: order.customer.city,
    totalAmount: order.total,
    paymentMethod: order.paymentMethod.toUpperCase(),
    itemsSummary: order.items.map((item) => ({
      title: item.product.title,
      quantity: item.quantity,
      image: item.product.image,
    })),
    checkpoints: checkpointsFor(order),
  };
}
