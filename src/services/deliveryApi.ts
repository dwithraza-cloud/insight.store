import { Order, TrackingDetails, TrackingCheckpoint } from '../types';

/**
 * Simulated Delivery & Courier Tracking API Service
 * Models realistic logistics integrations (TCS Express, Leopards, Trax, Swyft)
 * with latency, stage checkpoints, rider assignment, and parcel telemetry.
 */

// Known mock tracking numbers and order archives
const SEED_TRACKING_ARCHIVE: Record<string, Partial<TrackingDetails>> = {
  '#IS-94021': {
    orderId: '#IS-94021',
    carrier: 'TCS Express Logistics (Overnight Express)',
    trackingNumber: 'TCS-7729183492PK',
    status: 'Delivered',
    statusCode: 'delivered',
    progressPercent: 100,
    estimatedDelivery: 'Aug 12, 2026 - Delivered',
    origin: 'Insight Store Central Fulfillment, Gulberg III, Lahore',
    destination: 'House 18-B, Block C-2, Gulberg III, Lahore',
    recipientName: 'Muhammad Hamza',
    recipientPhone: '03145338340',
    recipientAddress: 'House 18-B, Block C-2, Gulberg III',
    recipientCity: 'Lahore',
    courierRider: {
      name: 'Muhammad Rizwan',
      phone: '0300-8472910',
      vehicle: 'Honda CG 125 (LEA-4821)'
    },
    totalAmount: 98999,
    paymentMethod: 'Cash on Delivery (COD)',
    checkpoints: [
      {
        id: 'cp-1',
        title: 'Order Placed & Payment Verified',
        location: 'Insight Store Online Portal, Lahore',
        timestamp: '10 Aug 2026, 02:45 PM',
        completed: true,
        description: 'Customer order confirmed and automated inventory allocation verified.'
      },
      {
        id: 'cp-2',
        title: 'Quality Inspected & Sealed',
        location: 'Warehouse Dock A-4, Gulberg III, Lahore',
        timestamp: '11 Aug 2026, 09:15 AM',
        completed: true,
        description: 'Package tamper-proof sealed with warranty documentation enclosed.'
      },
      {
        id: 'cp-3',
        title: 'Handed to Courier Hub',
        location: 'TCS Regional Sorting Center, Cargo Complex, Lahore',
        timestamp: '11 Aug 2026, 05:30 PM',
        completed: true,
        description: 'Consignment booked under Airway Bill #TCS-7729183492PK.'
      },
      {
        id: 'cp-4',
        title: 'Arrived at Local Delivery Station',
        location: 'Gulberg Delivery Station, Lahore',
        timestamp: '12 Aug 2026, 08:30 AM',
        completed: true,
        description: 'Parcel sorted and allocated to delivery run sheet #582.'
      },
      {
        id: 'cp-5',
        title: 'Out for Delivery with Rider',
        location: 'Gulberg III Sector Route, Lahore',
        timestamp: '12 Aug 2026, 11:20 AM',
        completed: true,
        description: 'Rider Muhammad Rizwan dispatched with contactless delivery verification.'
      },
      {
        id: 'cp-6',
        title: 'Delivered Successfully',
        location: 'Recipient Address, Gulberg III, Lahore',
        timestamp: '12 Aug 2026, 02:15 PM',
        completed: true,
        current: true,
        description: 'Delivered and signed by Muhammad Hamza. Payment collected.'
      }
    ]
  },
  '#IS-10428': {
    orderId: '#IS-10428',
    carrier: 'Leopards Courier Service (Flyer Express)',
    trackingNumber: 'LCS-883920194PK',
    status: 'In Transit',
    statusCode: 'in_transit',
    progressPercent: 65,
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    origin: 'Insight Store Central Fulfillment, Gulberg III, Lahore',
    destination: 'Apartment 402, Royal Residency, F-11/1, Islamabad',
    recipientName: 'Bilal Farooq',
    recipientPhone: '0321-9923841',
    recipientAddress: 'Apartment 402, Royal Residency, F-11/1',
    recipientCity: 'Islamabad',
    totalAmount: 92999,
    paymentMethod: 'Online Debit / Card',
    checkpoints: [
      {
        id: 'cp-1',
        title: 'Order Confirmed',
        location: 'Insight Store Online Portal, Lahore',
        timestamp: 'Yesterday, 11:30 AM',
        completed: true,
        description: 'Digital payment captured. Order passed to fulfillment center.'
      },
      {
        id: 'cp-2',
        title: 'Packed & Barcode Dispatched',
        location: 'Insight Fulfillment Center, Lahore',
        timestamp: 'Yesterday, 04:00 PM',
        completed: true,
        description: 'Goods secured in bubble cushion and packaged for interstate transit.'
      },
      {
        id: 'cp-3',
        title: 'Intercity Transit Motorway (M-2)',
        location: 'Leopards Regional Gateway, Rawalpindi / Islamabad',
        timestamp: 'Today, 06:45 AM',
        completed: true,
        current: true,
        description: 'Consignment arrived at regional gateway. Sorting for final delivery depot.'
      },
      {
        id: 'cp-4',
        title: 'Out for Delivery',
        location: 'F-11 Delivery Center, Islamabad',
        timestamp: 'Scheduled for Tomorrow, 10:00 AM',
        completed: false,
        description: 'Will be assigned to local delivery rider upon morning run.'
      },
      {
        id: 'cp-5',
        title: 'Delivery Pending',
        location: 'Customer Address, Islamabad',
        timestamp: 'Estimated Tomorrow, 04:00 PM',
        completed: false,
        description: 'Package will be handed over with digital delivery acknowledgment.'
      }
    ]
  },
  '#IS-10387': {
    orderId: '#IS-10387',
    carrier: 'Trax Logistics (Priority Direct)',
    trackingNumber: 'TRX-551029481PK',
    status: 'Out for Delivery',
    statusCode: 'out_for_delivery',
    progressPercent: 88,
    estimatedDelivery: 'Today by 6:30 PM',
    origin: 'Insight Store Central Fulfillment, Gulberg III, Lahore',
    destination: 'House 44, Street 9, DHA Phase 5, Lahore',
    recipientName: 'Ayesha Siddiqui',
    recipientPhone: '0333-4412980',
    recipientAddress: 'House 44, Street 9, DHA Phase 5',
    recipientCity: 'Lahore',
    courierRider: {
      name: 'Kamran Ali',
      phone: '0312-5884912',
      vehicle: 'Suzuki GD 110S (LEB-9102)'
    },
    totalAmount: 24999,
    paymentMethod: 'Cash on Delivery (COD)',
    checkpoints: [
      {
        id: 'cp-1',
        title: 'Order Confirmed',
        location: 'Insight Store Online',
        timestamp: '15 Sep 2026, 09:00 AM',
        completed: true,
        description: 'Order confirmed and scheduled for same-city dispatch.'
      },
      {
        id: 'cp-2',
        title: 'Dispatched from Warehouse',
        location: 'Gulberg III Fulfillment Center',
        timestamp: '15 Sep 2026, 03:00 PM',
        completed: true,
        description: 'Package handed over to Trax Logistics courier team.'
      },
      {
        id: 'cp-3',
        title: 'DHA Hub Sorting Complete',
        location: 'Trax DHA Phase 5 Delivery Station',
        timestamp: 'Today, 08:30 AM',
        completed: true,
        description: 'Scanned at destination hub and assigned to rider route.'
      },
      {
        id: 'cp-4',
        title: 'Out for Delivery with Rider',
        location: 'DHA Phase 5, Sector G Route',
        timestamp: 'Today, 10:15 AM',
        completed: true,
        current: true,
        description: 'Rider Kamran Ali is on route. Expected drop-off in the afternoon.'
      },
      {
        id: 'cp-5',
        title: 'Delivered & Cash Collected',
        location: 'Customer Address, DHA Phase 5',
        timestamp: 'Pending Delivery',
        completed: false,
        description: 'Payment collection and OTP confirmation upon customer handover.'
      }
    ]
  }
};

/**
 * Normalizes user input (strips extra spaces, standardizes '#' prefix)
 */
export function normalizeOrderId(id: string): string {
  const cleaned = id.trim().toUpperCase();
  if (!cleaned) return '';
  if (!cleaned.startsWith('#') && cleaned.startsWith('IS')) {
    return `#${cleaned}`;
  }
  if (!cleaned.startsWith('#') && !cleaned.startsWith('IS')) {
    return `#IS-${cleaned}`;
  }
  return cleaned;
}

/**
 * Simulated Delivery Tracking API Call
 * Mimics an external RESTful API call with latency and deterministic/dynamic tracking resolution.
 */
export async function fetchTrackingStatus(
  inputOrderId: string,
  userOrders: Order[] = []
): Promise<TrackingDetails> {
  // Simulate network latency (650ms - 900ms)
  const delayMs = 600 + Math.floor(Math.random() * 300);
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const cleanId = normalizeOrderId(inputOrderId);

  if (!cleanId || cleanId.length < 4) {
    throw new Error('Please enter a valid Order ID (e.g., #IS-94021 or IS-10428).');
  }

  // 1. Check if it matches an existing active order in the user's account state
  const matchedUserOrder = userOrders.find(
    (o) => o.id.toUpperCase() === cleanId || normalizeOrderId(o.id) === cleanId
  );

  if (matchedUserOrder) {
    const isDelivered = matchedUserOrder.status === 'Delivered';
    const isShipped = matchedUserOrder.status === 'Shipped';
    
    return {
      orderId: matchedUserOrder.id,
      carrier: 'TCS Express Logistics (FastTrack)',
      trackingNumber: `TCS-${Math.abs(cleanId.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 31, 719283)).toString().slice(0, 10)}PK`,
      status: isDelivered ? 'Delivered' : isShipped ? 'In Transit' : 'Processing',
      statusCode: isDelivered ? 'delivered' : isShipped ? 'in_transit' : 'processing',
      progressPercent: isDelivered ? 100 : isShipped ? 70 : 35,
      estimatedDelivery: isDelivered 
        ? `${matchedUserOrder.date} (Delivered)` 
        : 'Estimated in 1–2 business days',
      origin: 'Insight Store Central Fulfillment, Gulberg III, Lahore',
      destination: `${matchedUserOrder.customer.address}, ${matchedUserOrder.customer.city}`,
      recipientName: matchedUserOrder.customer.fullName,
      recipientPhone: matchedUserOrder.customer.phone,
      recipientAddress: matchedUserOrder.customer.address,
      recipientCity: matchedUserOrder.customer.city,
      courierRider: isDelivered || isShipped ? {
        name: 'Muhammad Rizwan',
        phone: '0300-8472910',
        vehicle: 'Courier Van / Motorbike'
      } : undefined,
      totalAmount: matchedUserOrder.total,
      paymentMethod: matchedUserOrder.paymentMethod.toUpperCase(),
      itemsSummary: matchedUserOrder.items.map((i) => ({
        title: i.product.title,
        quantity: i.quantity,
        image: i.product.image
      })),
      checkpoints: [
        {
          id: 'cp-1',
          title: 'Order Confirmed',
          location: 'Insight Store Online',
          timestamp: matchedUserOrder.date,
          completed: true,
          description: `Order verified with ${matchedUserOrder.paymentMethod.toUpperCase()} payment.`
        },
        {
          id: 'cp-2',
          title: 'Packaging & Warehouse Allocation',
          location: 'Gulberg III Fulfillment Depot',
          timestamp: matchedUserOrder.date,
          completed: true,
          description: `${matchedUserOrder.items.length} item(s) secured with protective packaging.`
        },
        {
          id: 'cp-3',
          title: 'Dispatched with Courier Partner',
          location: 'TCS Regional Hub, Lahore',
          timestamp: isDelivered || isShipped ? 'Next Morning, 08:00 AM' : 'In Preparation',
          completed: isDelivered || isShipped,
          current: !isDelivered && isShipped,
          description: isDelivered || isShipped 
            ? 'Airway Bill generated and assigned to delivery line.' 
            : 'Pending courier pickup.'
        },
        {
          id: 'cp-4',
          title: 'Out for Delivery',
          location: `${matchedUserOrder.customer.city} Delivery Depot`,
          timestamp: isDelivered ? 'Same Day, 11:30 AM' : 'Scheduled',
          completed: isDelivered,
          description: isDelivered ? 'Dispatched with local field rider.' : 'Awaiting arrival at local hub.'
        },
        {
          id: 'cp-5',
          title: isDelivered ? 'Delivered & Completed' : 'Final Delivery',
          location: matchedUserOrder.customer.city,
          timestamp: isDelivered ? `${matchedUserOrder.date}, 02:30 PM` : 'Pending Delivery',
          completed: isDelivered,
          current: isDelivered,
          description: isDelivered 
            ? `Successfully handed to ${matchedUserOrder.customer.fullName}.` 
            : 'Will be delivered upon destination arrival.'
        }
      ]
    };
  }

  // 2. Check seed archive (e.g., demo orders #IS-10428, #IS-10387)
  const archived = SEED_TRACKING_ARCHIVE[cleanId];
  if (archived) {
    return {
      orderId: cleanId,
      carrier: archived.carrier || 'TCS Express Logistics',
      trackingNumber: archived.trackingNumber || 'TCS-991823101PK',
      status: archived.status || 'In Transit',
      statusCode: archived.statusCode || 'in_transit',
      progressPercent: archived.progressPercent || 50,
      estimatedDelivery: archived.estimatedDelivery || 'In 2 business days',
      origin: archived.origin || 'Gulberg III, Lahore',
      destination: archived.destination || 'Lahore, Pakistan',
      recipientName: archived.recipientName || 'Insight Store Customer',
      recipientPhone: archived.recipientPhone || '03145338340',
      recipientAddress: archived.recipientAddress || 'Gulberg III',
      recipientCity: archived.recipientCity || 'Lahore',
      checkpoints: archived.checkpoints || [],
      courierRider: archived.courierRider,
      totalAmount: archived.totalAmount || 25000,
      paymentMethod: archived.paymentMethod || 'Cash on Delivery',
      itemsSummary: [
        {
          title: 'Premium Sound ANC Headset & Accessories',
          quantity: 1,
          image: 'https://insightstore.designerinsight.online/images/products/soundcore-space-one.webp'
        }
      ]
    };
  }

  // 3. Dynamic generation for any valid user order ID format (e.g. #IS-77412, IS-5590)
  // Deterministic mock generation based on hash of orderId so identical inputs give consistent results
  let hash = 0;
  for (let i = 0; i < cleanId.length; i++) {
    hash = (hash << 5) - hash + cleanId.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const statuses: ('Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered')[] = [
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Processing'
  ];
  const selectedStatus = statuses[positiveHash % statuses.length];
  const isDelivered = selectedStatus === 'Delivered';
  const isOut = selectedStatus === 'Out for Delivery';
  const isInTransit = selectedStatus === 'In Transit';

  const carriers = [
    'TCS Express Logistics',
    'Leopards Courier Service',
    'Trax Priority Direct',
    'Swyft Logistics'
  ];
  const selectedCarrier = carriers[positiveHash % carriers.length];
  const awb = `PK-${(positiveHash % 90000000 + 10000000).toString()}`;

  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi', 'Multan'];
  const destinationCity = cities[positiveHash % cities.length];

  const progressPercent = isDelivered ? 100 : isOut ? 85 : isInTransit ? 60 : 30;

  const checkpoints: TrackingCheckpoint[] = [
    {
      id: 'cp-1',
      title: 'Order Verified & Booked',
      location: 'Insight Store Fulfillment, Lahore',
      timestamp: '2 days ago, 10:15 AM',
      completed: true,
      description: 'Order registered and inventory confirmed.'
    },
    {
      id: 'cp-2',
      title: 'Packed & Barcoded',
      location: 'Central Distribution Center, Gulberg III, Lahore',
      timestamp: 'Yesterday, 02:30 PM',
      completed: true,
      description: 'Protective packaging applied with serial numbers recorded.'
    },
    {
      id: 'cp-3',
      title: `Handed over to ${selectedCarrier}`,
      location: 'Logistics Sort Center, Lahore',
      timestamp: 'Yesterday, 07:45 PM',
      completed: isDelivered || isOut || isInTransit,
      current: selectedStatus === 'In Transit',
      description: `Consignment scanned onto outbound transit vehicle (AWB: ${awb}).`
    },
    {
      id: 'cp-4',
      title: `Arrived at ${destinationCity} Hub`,
      location: `${destinationCity} Express Station`,
      timestamp: isDelivered || isOut ? 'Today, 08:30 AM' : 'Estimated tomorrow',
      completed: isDelivered || isOut,
      current: isOut,
      description: isDelivered || isOut 
        ? `Consignment reached ${destinationCity} and assigned for delivery.` 
        : 'In transit to destination facility.'
    },
    {
      id: 'cp-5',
      title: isDelivered ? 'Delivered' : 'Delivery Execution',
      location: destinationCity,
      timestamp: isDelivered ? 'Today, 01:20 PM' : 'Expected in 24–48 hours',
      completed: isDelivered,
      current: isDelivered,
      description: isDelivered 
        ? 'Package delivered to recipient with electronic signature.' 
        : `Scheduled for delivery in ${destinationCity}.`
    }
  ];

  return {
    orderId: cleanId,
    carrier: selectedCarrier,
    trackingNumber: awb,
    status: selectedStatus,
    statusCode: isDelivered ? 'delivered' : isOut ? 'out_for_delivery' : isInTransit ? 'in_transit' : 'processing',
    progressPercent,
    estimatedDelivery: isDelivered ? 'Delivered' : 'Within 24–48 hours',
    origin: 'Insight Store Central Fulfillment, Gulberg III, Lahore',
    destination: `Customer Address, ${destinationCity}, Pakistan`,
    recipientName: 'Valued Customer',
    recipientPhone: '03145338340',
    recipientAddress: `Delivery Address, ${destinationCity}`,
    recipientCity: destinationCity,
    courierRider: isOut || isDelivered ? {
      name: 'Rider Tariq Mahmood',
      phone: '0301-7654321',
      vehicle: 'Motorcycle (LHR-6192)'
    } : undefined,
    totalAmount: (positiveHash % 85000) + 9999,
    paymentMethod: 'Cash on Delivery (COD)',
    itemsSummary: [
      {
        title: 'Insight Store Verified Electronics Order',
        quantity: 1,
        image: 'https://insightstore.designerinsight.online/images/products/soundcore-space-one.webp'
      }
    ],
    checkpoints
  };
}
