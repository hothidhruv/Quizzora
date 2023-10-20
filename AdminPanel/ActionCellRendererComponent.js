class ActionCellRendererComponent {
  // gets called once before the renderer is used
  init(params) {
    // create the cell
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `
          <span>
              <i class='fa fa-trash' id= 'delete-icon'></i>
          </span>
       `;

    // get references to the elements we want
    this.eButton = this.eGui.querySelector('#delete-icon');

    // set value into cell
    this.cellValue = this.getValueToDisplay(params.data);


    // add event listener to button
    this.eventListener = () => (deleteUser(this.cellValue));
    this.eButton.addEventListener('click', this.eventListener);
  }

  getGui() {
    return this.eGui;
  }

  getValueToDisplay(params) {
    // return params.valueFormatted ? params.valueFormatted : params.value;
    return params.id;
  }
}