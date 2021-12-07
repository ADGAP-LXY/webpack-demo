function component() {
  const element = document.createElement('div');
console.log('location.pathname:',location.pathname) //location.pathname?
  if (location.pathname === '/') {
    element.innerHTML = 'hello world';
  } else if (location.pathname.startsWith('/about/')) {
    const name = location.pathname.slice(7)
    element.innerHTML = 'loading...'; //??
    fetch('/api/info?name=' + name).then(resp => resp.json()).then(info => {
      if (info.error) {
        element.innerHTML = info.error.message
        // console.log('info.error.message:', info.error.message)
        return
      }
      element.innerHTML = `${info.name}, come from ${info.from}`
    })
  } else {
    element.innerHTML = 'not found';
  }

  return element;
}

document.body.appendChild(component());