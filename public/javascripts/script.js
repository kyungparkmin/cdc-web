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


