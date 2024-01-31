import { RequestButtonsInterface } from "./RequestButtonsInterface.ts";

function RequestButtons({ submit }: RequestButtonsInterface) {
  function handleSubmit() {
    submit();
  }

  return (
    <div className={"requestButtonsDiv"}>
      <button type={"button"} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default RequestButtons;
