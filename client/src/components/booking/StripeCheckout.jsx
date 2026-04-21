// d:/kaaya eco resort/client/src/components/booking/StripeCheckout.jsx
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Lock, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import { formatPrice } from '../../utils/helpers.js'
import Spinner from '../common/Spinner.jsx'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

function CheckoutForm({ booking, onSuccess, onCancel }) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success?bookingId=${booking.id}`,
      },
      redirect: 'if_required',
    })

    if (error) {
      toast.error(error.message || 'Payment failed. Please try again.')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Booking summary */}
      <div className="bg-stone rounded-sm p-5 border border-sage/20 text-sm font-sans">
        <p className="font-sans text-xs uppercase tracking-wider text-timber/50 font-semibold mb-3">Booking Summary</p>
        <div className="space-y-1.5 text-timber/70">
          <div className="flex justify-between">
            <span>Room</span>
            <span className="font-medium text-timber">{booking.room?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Check-in</span>
            <span className="font-medium text-timber">{new Date(booking.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between">
            <span>Check-out</span>
            <span className="font-medium text-timber">{new Date(booking.checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between">
            <span>Guests</span>
            <span className="font-medium text-timber">{booking.adults} adults{booking.children > 0 ? `, ${booking.children} children` : ''}</span>
          </div>
          <div className="divider" />
          <div className="flex justify-between text-base font-semibold text-timber">
            <span>Total</span>
            <span className="text-forest">{formatPrice(booking.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Stripe payment element */}
      <div>
        <p className="font-sans text-xs uppercase tracking-wider text-timber/50 font-semibold mb-3">Payment Details</p>
        <div className="p-4 border border-sage/30 rounded-sm bg-white">
          <PaymentElement options={{ layout: 'tabs' }} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-timber/40 text-xs font-sans">
        <Lock size={11} />
        Secured by Stripe. Your card details are never stored on our servers.
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-outline flex-1 justify-center gap-2"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn-primary flex-1 justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <><Spinner size="sm" color="white" /> Processing…</> : `Pay ${formatPrice(booking.totalPrice)}`}
        </button>
      </div>
    </form>
  )
}

export default function StripeCheckout({ booking, onSuccess, onCancel }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [loadingIntent, setLoadingIntent] = useState(true)
  const [intentError, setIntentError]    = useState(null)

  useEffect(() => {
    if (!booking?.id) return

    api.post('/payments/create-intent', { bookingId: booking.id })
      .then(({ data }) => setClientSecret(data.clientSecret))
      .catch((err) => setIntentError(err.response?.data?.message || 'Payment setup failed'))
      .finally(() => setLoadingIntent(false))
  }, [booking?.id])

  if (loadingIntent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Spinner size="lg" />
        <p className="font-sans text-sm text-timber/50">Setting up secure payment…</p>
      </div>
    )
  }

  if (intentError) {
    return (
      <div className="text-center py-10">
        <p className="font-sans text-terra text-sm mb-4">{intentError}</p>
        <button onClick={onCancel} className="btn-outline">Go Back</button>
      </div>
    )
  }

  if (!clientSecret) return null

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary:    '#C8A96E',
            colorBackground: '#ffffff',
            colorText:       '#5C3D1E',
            colorDanger:     '#C1440E',
            fontFamily:      '"DM Sans", system-ui, sans-serif',
            borderRadius:    '2px',
          },
        },
      }}
    >
      <CheckoutForm booking={booking} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  )
}
