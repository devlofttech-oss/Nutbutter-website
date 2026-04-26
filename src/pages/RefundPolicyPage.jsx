import PolicyPageTemplate from '../components/PolicyPageTemplate.jsx'
import { POLICIES } from '../data/policyData.js'

export default function RefundPolicyPage() {
  return <PolicyPageTemplate policy={POLICIES.refund} />
}
