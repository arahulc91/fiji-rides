import { HelpCircle } from 'lucide-react'
import { HeroBackground } from '../components/hero-background'

const faqs = [
  {
    question: "What areas do you service?",
    answer: "We provide transportation services across all major islands in Fiji, including Viti Levu and Vanua Levu."
  },
  {
    question: "How do I book a transfer?",
    answer: "You can book through our website, mobile app, or by calling our 24/7 customer service line."
  },
  {
    question: "What types of vehicles are available?",
    answer: "We offer a range of vehicles from standard sedans to luxury SUVs and minivans."
  },
]

function FaqsPage() {
  return (
    <div className="flex flex-col">
      <HeroBackground>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <HelpCircle className="h-16 w-16 text-white" />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Find answers to common questions about our services.
            </p>
          </div>
        </div>
      </HeroBackground>

      {/* FAQs Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FaqsPage 