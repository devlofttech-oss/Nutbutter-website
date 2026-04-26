import PolicyPageTemplate from '../components/PolicyPageTemplate.jsx'
import { POLICIES } from '../data/policyData.js'

export default function TermsPage() {
  return <PolicyPageTemplate policy={POLICIES.terms} />
}
