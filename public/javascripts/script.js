function dropTask(id) {
  if (confirm("삭제하시겠습니까?")) {
    fetch(`/task/${id}`, {method: 'DELETE'})
      .then(response => {
        console.log(response);
        location.href = "/";
      })
      .catch(error => {
        console.error(error);
        alert("삭제에 실패했습니다.");
      });
  }
}

function dropAgent(id) {
  if(confirm("삭제하시겠습니까?")) {
    fetch(`/agent/${id}`, { method: 'DELETE' })
      .then(response => {
        console.log(response);
        location.href = "/agent";
      })
      .catch(error => {
        console.error(error);
        alert("삭제에 실패했습니다.");
      })
  }
}

// JavaScript code
let agentId;
document.addEventListener('DOMContentLoaded', function () {
  const modifyButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
  const modifyModal = document.getElementById('modifyModal');

  const updateModalInputs = (response) => {
    const modalInputs = modifyModal.querySelectorAll('input[name]');
    modalInputs.forEach((input) => {
      const inputName = input.getAttribute('name');
      input.value = response[inputName];
    });
  };

  const fetchAgentInfo = async (agentId) => {
    try {
      const response = await fetch(`/agent/${agentId}`);
      if (response.ok) {
        const data = await response.json();
        updateModalInputs(data);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  modifyButtons.forEach((button) => {
    button.addEventListener('click', function () {
      agentId = this.dataset.id;
      console.log(this.dataset)
      fetchAgentInfo(agentId);
    });
  });
});

const start = async (id) => {
  try {
    const response = await fetch(`/agent/start/${id}`, {
      method: 'GET',
    });
    console.log(response);
    location.href = "/agent";
  } catch (error) {
    console.error(error);
  }
}


const stop = async (id) => {
  try {
    const response = await fetch(`/agent/stop/${id}`, {
      method: 'GET'
    });
    console.log(response);
    location.href = "/agent";
  } catch (error) {
    console.error(error);
  }
}


const modify = async () => {
  const fields = ['name', 'path', 'username', 'password', 'database', 'table'];
  const updatedAgent = fields.reduce((obj, field) => {
    obj[field] = document.getElementById(field).value;
    return obj;
  }, {});

  try {
    const response = await fetch(`/agent/${agentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedAgent)
    });

    if (response.ok) {
      alert("수정되었습니다.");
      location.href = "/agent";
    } else {
      console.error(response.status);
    }
  } catch (error) {
    console.error(error);
  }
};
