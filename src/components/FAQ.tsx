import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "How accurate is the fabric visualization?",
      answer:
        "Our system uses advanced fabric mapping technology to provide highly accurate previews. The visualization accounts for fabric texture, pattern scaling, and lighting conditions to closely match real-world appearance.",
    },
    {
      question: "Which products can I visualize with this tool?",
      answer:
        "You can visualize fabrics on various products including t-shirts, dresses, pillows, curtains, and more. We regularly add new mockups to expand the available product range.",
    },
    {
      question: "Can I export my designs?",
      answer:
        "Yes! You can download high-resolution images of your fabric visualizations in PNG format. Simply click the Download button after creating your preview.",
    },
    {
      question: "Is the tool compatible with mobile devices?",
      answer:
        "Yes, FabricViz is fully responsive and works seamlessly on mobile devices, tablets, and desktop computers. The interface automatically adapts to your screen size.",
    },
    {
      question: "How long does it take to render a fabric?",
      answer:
        "Fabric rendering is instant! As soon as you select or upload a fabric design, it's immediately applied to the selected product mockup in real-time.",
    },
    {
      question: "Can I customize colors and patterns?",
      answer:
        "Yes, you can adjust various settings including scale, rotation, opacity, and blend modes to customize how your fabric appears on the product.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Find answers to common questions about FabricViz and how to get
            started.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-none mb-4"
              >
                <AccordionTrigger className="bg-gray-900/80 hover:bg-gray-900 px-6 py-4 rounded-xl text-left text-lg font-medium border border-gray-800 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="bg-gray-900/50 px-6 py-4 rounded-b-xl text-gray-300 border border-t-0 border-gray-800">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
