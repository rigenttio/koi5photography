import Navbar from "../components/Fragments/NavBar";
import Footer from "../components/Fragments/Footer";
import Input from "../components/Elements/Input/Input";
import Button from "../components/Elements/Button/Button";
import { useContact } from "../hooks/useContact";

const ContactPage = () => {
  const { handleContact, email, subject, message, setEmail, setSubject, setMessage, errorEmail, errorSubject, errorMessage } = useContact();
  return (
    <>
      <Navbar />

      <div className="my-[72px] container">
        <h2 className="text-4xl font-bold text-center mb-2">Punya Pertanyaan?</h2>
        <p className="text-sm font-medium text-center mb-6">Jika kamu memiliki masalah dan pertanyaan seputar Koi5 Photography silakan mengisi form dibawah ini.</p>
        <form onSubmit={handleContact}>
          <div className="flex flex-col gap-6 py-16 px-8 lg:px-28 bg-gray w-full lg:w-3/4 mx-auto rounded-3xl">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
            {errorEmail && <p className="-mt-4 font-normal text-xs text-red-500">{errorEmail}</p>}
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} type="text" placeholder="Subject" />
            {errorSubject && <p className="-mt-4 font-normal text-xs text-red-500">{errorSubject}</p>}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              cols="30"
              rows="5"
              placeholder="Pesan"
              className="text-dark text-sm font-light border-none appearance-none focus:outline-none w-full py-4 px-6 rounded-[10px] placeholder:opacity-70"
            ></textarea>
            {errorMessage && <p className="-mt-4 font-normal text-xs text-red-500">{errorMessage}</p>}
            <div className="mt-8 flex justify-center">
              <Button type="submit">Kirim</Button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
