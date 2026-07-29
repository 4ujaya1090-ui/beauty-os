import TextField from "../../../shared/components/TextField/TextField";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

type ClientFormProps = {
  name: string;
  phone: string;
  birthDate: string;

  setName: (value: string) => void;
  setPhone: (value: string) => void;
  setBirthDate: (value: string) => void;

  buttonText: string;
  onSubmit: () => void;
};

function ClientForm({
  name,
  phone,
  birthDate,
  setName,
  setPhone,
  setBirthDate,
  buttonText,
  onSubmit,
}: ClientFormProps) {
  return (
    <>
      <TextField
        label="Имя"
        value={name}
        onChange={setName}
      />

      <TextField
        label="Телефон"
        value={phone}
        onChange={setPhone}
      />

      <TextField
        label="Дата рождения"
        value={birthDate}
        onChange={setBirthDate}
      />

      <PrimaryButton onClick={onSubmit}>
        {buttonText}
      </PrimaryButton>
    </>
  );
}

export default ClientForm;