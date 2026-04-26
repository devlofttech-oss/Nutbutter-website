import PolicyPageTemplate from '../components/PolicyPageTemplate.jsx'
import { POLICIES } from '../data/policyData.js'

export default function ShippingPolicyPage() {
  return <PolicyPageTemplate policy={POLICIES.shipping} />
}
