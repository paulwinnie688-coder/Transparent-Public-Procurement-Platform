# 🌍 Transparent Public Procurement Platform

This project leverages the Stacks blockchain and Clarity smart contracts to create a transparent, tamper-proof public procurement platform. It addresses real-world issues like corruption, lack of transparency, and inefficiency in government procurement processes by ensuring all bidding and contract awarding processes are recorded immutably on the blockchain.

## ✨ Features

🔍 **Transparent Bidding**: All bids are publicly visible and verifiable on the blockchain.  
📜 **Immutable Records**: Procurement contracts and bids are stored immutably to prevent tampering.  
✅ **Fair Evaluation**: Automated bid evaluation based on predefined criteria.  
🔐 **Secure Identity**: Bidders and officials are verified using blockchain-based identities.  
🔔 **Auditability**: All actions are logged for public auditing.  
⚖️ **Dispute Resolution**: Built-in mechanisms for resolving disputes transparently.  
💸 **Automated Payments**: Escrow and payment release upon contract completion.  

## 🛠 How It Works

**For Government Officials**  
- Create a procurement request with specifications and criteria.  
- Publish the request to the blockchain.  
- Review submitted bids and award contracts transparently.  

**For Bidders**  
- Register with a verified blockchain identity.  
- Submit bids with pricing and supporting documents (hashed for privacy).  
- Track bid status and contract awards.  

**For Auditors/Public**  
- Access procurement records to verify fairness and compliance.  
- Audit contract awards and payment releases.  

## 📂 Smart Contracts (8 Total)

1. **ProcurementRegistry**: Manages the creation and listing of procurement requests.  
2. **BidSubmission**: Handles bid submissions and ensures compliance with requirements.  
3. **IdentityVerification**: Verifies identities of bidders and officials using public keys.  
4. **EvaluationCriteria**: Stores and enforces bid evaluation rules.  
5. **ContractAward**: Records contract awards and prevents unauthorized changes.  
6. **EscrowManagement**: Manages funds in escrow and releases payments upon completion.  
7. **DisputeResolution**: Facilitates dispute reporting and resolution with voting.  
8. **AuditLog**: Logs all actions for transparency and public auditing.  

## 🚀 Getting Started

1. **Deploy Contracts**: Deploy the Clarity smart contracts on the Stacks blockchain.  
2. **Register Identities**: Government officials and bidders register their identities.  
3. **Create Procurement Request**: Officials create a request with criteria and deadlines.  
4. **Submit Bids**: Verified bidders submit their bids.  
5. **Evaluate and Award**: Bids are evaluated automatically, and contracts are awarded.  
6. **Audit and Verify**: Public can audit the process via the AuditLog contract.  

## 🛠 Tech Stack

- **Blockchain**: Stacks  
- **Smart Contract Language**: Clarity  
- **Frontend (Optional)**: React for a user-friendly interface  
- **Hashing**: SHA-256 for document integrity  

## 📜 License

MIT License - feel free to use and contribute!

