import { PaymentResultShell } from './PaymentSuccessPage.jsx'

export default function PaymentFailedPage() {
  return (
    <PaymentResultShell
      icon="error"
      title="Payment Failed"
      message="Your payment could not be completed. No confirmed order has been charged."
    />
  )
}

