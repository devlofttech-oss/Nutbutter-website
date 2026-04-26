import PolicyPageTemplate from '../components/PolicyPageTemplate.jsx'
import { POLICIES } from '../data/policyData.js'

export default function PrivacyPolicyPage() {
  return <PolicyPageTemplate policy={POLICIES.privacy} />
}
