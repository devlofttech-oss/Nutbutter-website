import { useState } from 'react'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import ContactHero from '../components/ContactHero.jsx'
import ContactInfo from '../components/ContactInfo.jsx'
import ContactForm from '../components/ContactForm.jsx'
import MapSection from '../components/MapSection.jsx'
import WhatsAppCTA from '../components/WhatsAppCTA.jsx'

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
}

export default function ContactPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setSubmitted(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateContactForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
      setValues(initialValues)
    }
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <ContactHero />

        <section className="max-w-7xl mx-auto px-8 md:px-12 mb-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            <div className="lg:col-span-5 space-y-lg">
              <ContactInfo />
              <WhatsAppCTA />
            </div>

            <div className="lg:col-span-7">
              <ContactForm
                values={values}
                errors={errors}
                submitted={submitted}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </section>

        <MapSection />
      </main>
      <Footer />
    </div>
  )
}

function validateContactForm(values) {
  const errors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!values.fullName.trim()) {
    errors.fullName = 'Please enter your name.'
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!emailPattern.test(values.email)) {
    errors.email = 'Please enter a valid email.'
  }

  if (!values.message.trim()) {
    errors.message = 'Please add a message.'
  } else if (values.message.trim().length < 10) {
    errors.message = 'Please share a little more detail.'
  }

  return errors
}
