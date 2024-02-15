import { RequestButtonsInterface } from "./RequestButtonsInterface.ts";
import "../../css/component-css/buttons/requestButton.css";

function RequestButtons({ submit }: RequestButtonsInterface) {
  function handleSubmit() {
    submit();
  }

  function show() {
      const tag: HTMLElement = document.getElementById("popup") as HTMLElement;
      tag.style.opacity = "1";
      setInterval(fadeEffect, 300);
  }

  function fadeEffect() {
      const target = document.getElementById("popup") as HTMLElement;
      let opacity = target.style.opacity;
        if(opacity != "0") {
            opacity = (Number(opacity) - 0.03).toString();
            target.style.opacity = opacity;
        }

  }

  return (
      <div className={"requestButtonsDiv"}>
          <button type={"button"} onClick={() => {
           handleSubmit();
           show();
          }}
                  className={"requestButton"}>
              Submit
          </button>
          <br/>
          <div id={"popup"} className={"popup"}>
              <h3 className={"popup-words"}>
                  Successfully submitted!
              </h3>
          </div>
      </div>
  );
}

export default RequestButtons;
