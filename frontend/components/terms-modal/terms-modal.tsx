import React, { FC } from "react";
import styles from "./terms-modal.module.css";
import { useModalStore } from "@/context/modal_store";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { XIcon } from "@/components/ui/icons";

export interface TermsModalProps {}

export const TermsModal: FC<TermsModalProps> = ({}) => {
  const { termsModalOpen, setTermsModalOpen } = useModalStore();

  return (
    <Modal
      open={termsModalOpen}
      onClose={() => setTermsModalOpen(false)}
      aria-labelledby="terms-modal-title"
      aria-describedby="terms-modal-description"
      className={styles.modalBackdrop}
    >
      <Box sx={modalStyle}>
        <div className={styles.modalHeader}>
          <h2 id="terms-modal-title">Terms and Conditions</h2>
          <div
            className={styles.close}
            onClick={() => setTermsModalOpen(false)}
          >
            <XIcon />
          </div>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.termsText}>
            <h3>Projoint Design Tool Terms of Service</h3>

            <p>
              <strong>Last updated:</strong> July 14, 2024
            </p>

            <p>
              Welcome to Projoint Design Tool, a research platform offered by
              the President and Fellows of Harvard College ("Harvard"), acting
              through its Institute for Quantitative Social Science.
            </p>

            <p>
              By using the Projoint Design Tool platform, which includes all web
              access through https://projoint.aaronrkaufman.com/, and/or
              otherwise accessing Projoint Design Tool, you accept and agree to
              be bound by the following Terms of Service:
            </p>

            <div style={{ marginLeft: "1.5rem" }}>
                <h4>1. <u>Scope and Description of Service</u></h4>
                <p>
                  The Projoint Design Tool platform (the "Service") includes all
                  services provided to you in connection with your use of
                  Projoint Design Tool. The Service is intended to be used both
                  by researchers conducting surveys as part of their research,
                  studies, or investigations (each a "Researcher"), and by
                  respondents to such surveys (each a "Respondent"). In each
                  case, the survey, and the broader research project with which
                  such survey is connected, will be known as the "Research".
                </p>

                <h4>2. <u>Appropriate Use/Conduct</u></h4>
                <p>
                  You agree that you are responsible for your own use of the
                  Service. You agree that you will use the Service in compliance
                  with these Terms of Service and all applicable local, state,
                  national and international laws, rules, and regulations,
                  including privacy and copyright laws, any laws regarding the
                  transmission of technical data exported from your country of
                  residence, and all United States export control laws.
                </p>
                <p>In addition, you agree that you will not:</p>
                <ul>
                  <li>
                    Access or use the Service for any reason other than its
                    intended purpose.
                  </li>
                  <li>Reverse-engineer the Service.</li>
                  <li>
                    Use the Service in any manner intended to damage, disable,
                    overburden, interfere with, or disrupt any part of the
                    Service, the computer equipment or network(s) connected to
                    the Service, or any other user's access to or use of the
                    Service.
                  </li>
                  <li>
                    Attempt to gain unauthorized access to the Service, any
                    Service user accounts, or computer equipment or networks
                    connected to the Service by any means.
                  </li>
                  <li>
                    Obtain or attempt to obtain any materials or information on
                    or via the Service not intentionally made available to you
                    through the Service.
                  </li>
                  <li>
                    Use any high volume or automated means to access the Service
                    (including, without limitation, robots, spiders, or
                    scripts).
                  </li>
                  <li>
                    Attempt to disrupt the ordinary functioning of any chatbot
                    available through the Service, including, without
                    limitation, via jailbreaking, prompt leaking, prompt
                    injection, data exfiltration, or using such chatbot for any
                    purpose not connected with Research.
                  </li>
                  <li>
                    Frame the Service, place pop-up windows over its pages, or
                    otherwise affect the display of its pages.
                  </li>
                  <li>
                    Force headers or otherwise manipulate identifiers in order
                    to disguise the origin of any communication transmitted
                    through the Service.
                  </li>
                </ul>

                <h4>3. <u>Service License</u></h4>
                <p>
                  Subject to your compliance with these Terms of Service,
                  Harvard hereby grants you a limited, revocable license to
                  access and use the Service: (a) solely in order to carry out
                  Research if you are a Researcher; and (b) solely in order to
                  solicit your feedback on Research you participated in if you
                  are a Respondent.
                </p>

                <h4>4. <u>Your Content</u></h4>
                <p>
                  You will be able to submit certain content and data to the
                  Service. If you are a Researcher, such content will consist of
                  survey questions connected to your Research, along with
                  possible responses to such questions. If you are a Respondent,
                  such content will consist of your responses to any survey
                  questions you answered during your participation in Research,
                  along with any information you input into the Service. In each
                  case, these Terms of Service will refer to all such content
                  and data, collectively, as "Content".
                </p>
                <p>
                  By submitting Content or causing Content to be submitted to
                  the Service, you grant Harvard a perpetual, irrevocable,
                  worldwide, transferable, royalty-free, fully paid-up,
                  non-exclusive license to reproduce, publicly perform, publicly
                  display, and distribute such Content in order to (a) operate,
                  provide, support, and improve the Service; (b) in the case of
                  Content provided by a Respondent, to share such Content, or
                  summaries or excerpts thereof, with Researchers; and (c) to
                  conduct research, so long as such research does not require
                  additional consents from or notices to any Respondent under
                  applicable law.
                </p>
                <p>
                  You understand that Content that you submit may not remain
                  confidential, so you should not submit anything that you do
                  not want communicated to others, including anything that may
                  embarrass you or expose you to a risk of litigation.
                </p>

                <h4>5. <u>Consent to Collection and Use of Information</u></h4>
                <p>
                  The Service may collect data for each user as set forth in the
                  Projoint Design Tool Privacy Statement ("Privacy Statement")
                  or as otherwise disclosed in the Service. You acknowledge that
                  you have read and understand the Privacy Statement.
                </p>

                <h4>6. <u>AI Acknowledgment</u></h4>
                <p>
                  The Service may include chatbots powered by large language
                  models and other artificial intelligence tools. Artificial
                  intelligence, machine learning, and large language models are
                  novel and rapidly evolving technologies. Accordingly, you
                  understand and agree that the output provided by any chatbot
                  on the Service may not be accurate, current, or complete, may
                  contain content that is inconsistent with the views of
                  Harvard, and should not be relied on without independent
                  confirmation, or relied on as a substitute for professional
                  advice.
                </p>

                <h4>7. <u>Disclaimer of Warranty</u></h4>
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE
                  AND ANY INFORMATION, PRODUCTS, OR SERVICES THEREIN OR OBTAINED
                  THEREBY ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND
                  (EXPRESS, IMPLIED, OR OTHERWISE), INCLUDING, WITHOUT
                  LIMITATION, ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
                  FOR A PARTICULAR PURPOSE, OR NONINFRINGEMENT. WE DO NOT
                  WARRANT THAT THE SERVICE WILL OPERATE IN AN UNINTERRUPTED OR
                  ERROR-FREE MANNER OR THAT THE SERVICE IS FREE OF VIRUSES OR
                  OTHER HARMFUL COMPONENTS.
                </p>

                <h4>8. <u>Limitation of Liability</u></h4>
                <p>
                  EXCEPT INSOFAR AS THE FOLLOWING LIMITATION MAY BE PROHIBITED
                  BY APPLICABLE LAW, WE SHALL NOT BE LIABLE TO YOU OR TO ANY
                  THIRD PARTY FOR ANY DIRECT, CONSEQUENTIAL, INDIRECT, PUNITIVE,
                  SPECIAL, OR INCIDENTAL DAMAGES, WHETHER FORESEEABLE OR
                  UNFORESEEABLE (INCLUDING, BUT NOT LIMITED TO, LOSS OF PROFITS
                  OR EARNING POWER, LOSS OF DATA, LOSSES DUE TO ERRORS OR
                  INTERRUPTION IN AVAILABILITY OF THE SERVICE), ARISING OUT OF
                  OR RELATING TO THE SERVICE.
                </p>

                <h4>9. <u>Indemnification</u></h4>
                <p>
                  You agree to indemnify and hold harmless us from any and all
                  claims, liabilities, damages, losses and expenses, including
                  reasonable attorneys' fees and costs, relating to or arising
                  out of (a) your use or attempted use of the Service in
                  violation of these Terms of Service; or (b) your violation of
                  any law or rights of any third party in connection with your
                  use of the Service.
                </p>

                <h4>10. <u>Links</u></h4>
                <p>
                  The Service may include hyperlinks to websites or applications
                  maintained or controlled by others, including apps developed
                  and deployed by third parties. We are not responsible for and
                  do not approve or endorse the contents or use of any of the
                  information, products, or services that may be offered at
                  these websites or applications.
                </p>

                <h4>11. <u>Choice of Law</u></h4>
                <p>
                  You agree that the Terms of Service and any claim or dispute
                  arising out of or relating to the Terms of Service, or the
                  Service and your use of the Service, will be governed by the
                  laws of the Commonwealth of Massachusetts, excluding its
                  conflicts of laws principles.
                </p>

                <h4>12. <u>Whole Agreement/Amendments</u></h4>
                <p>
                  These Terms of Service and the Privacy Statement together
                  constitute the entire agreement between you and Harvard with
                  respect to your use of the Platform and this Service. Harvard
                  reserves the right to amend these Terms of Service at any
                  time.
                </p>
            </div>

            <h3>Projoint Design Tool Privacy Statement</h3>

            <p>
              This Privacy Statement discloses the privacy practices for
              https://projoint.aaronrkaufman.com/, the website of the Projoint
              Design Tool Service offered by the Institute for Quantitative
              Social Science at Harvard (the "Service").
            </p>

            <h4>What information do we gather about you?</h4>
            <p>
              We and our third-party vendors collect certain information
              regarding your use of the Service, such as your IP address and
              browser type. We may use your IP address to identify the general
              geographic area from which you are accessing the Service. We also
              collect any personal information which you submit directly to the
              Service or cause to be submitted to the Service.
            </p>

            <h4>What do we use your information for?</h4>
            <p>
              We use the information we gather from you to provide the Service
              to researchers and research participants, to maintain and improve
              the Service, and for systems administration purposes, abuse
              prevention, to track user trends, and for the other purposes
              described in this policy.
            </p>

            <h4>How is this information collected and how can you opt out?</h4>
            <p>
              Google and other third parties may use cookies, web beacons, and
              similar technologies to collect or receive information from this
              website and elsewhere on the internet and use that information to
              provide measurement services and target ads.
            </p>

            <h4>Cookies</h4>
            <p>
              Cookies are small files that are stored on your computer (unless
              you block them). We use cookies to identify researchers using the
              Service on future visits, to understand and save your preferences
              for future visits, and compile aggregate data about site traffic
              and site interaction.
            </p>

            <h4>Information protection</h4>
            <p>
              This site has reasonable security measures in place to help
              protect against the loss, misuse, and alteration of the
              information under our control. However, no method of transmission
              over the Internet or method of electronic storage is 100% secure.
            </p>

            <p className={styles.lastUpdated}>Effective date: July 14, 2025</p>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  maxHeight: "80vh",
  bgcolor: "var(--light-blue)",
  borderRadius: "1rem",
  overflow: "hidden",
  border: "none",
  outline: "none",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
};
