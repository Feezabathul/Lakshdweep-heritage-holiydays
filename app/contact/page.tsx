import { redirect } from "next/navigation";

export const metadata = {
  title: "Contact Us | Lakshadweep Heritage Holidays",
  description: "Book your Lakshadweep package enquiry. Get instant callback and entry permit details from our travel specialists.",
};

export default function ContactPage() {
  redirect("/#contact");
}
