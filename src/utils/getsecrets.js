// call the API https://otn6zi7itj.execute-api.us-east-2.amazonaws.com/Stage1/get-secrets to get the value
// need to get the REACT_APP_OPENAI_API_KEY from the body of the response
// need to get the REACT_APP_SUPABASE_API_KEY from the body of the response
// need to get the REACT_APP_SUPABASE_URL_LC_CHATBOT from the body of the response

// call the API https://otn6zi7itj.execute-api.us-east-2.amazonaws.com/Stage1/get-secrets to get the value
async function fetchSecrets() {
    const urlParams = new URLSearchParams(window.location.search);
    const idToken = urlParams.get("idToken");
  
    console.log(idToken);
    // Prepare the headers with the Authorization token
    const headers = {
      Authorization: idToken ? `Bearer ${idToken}` : "",
    };
  
    // Make the fetch request with the headers
    const response = await fetch(
      "https://otn6zi7itj.execute-api.us-east-2.amazonaws.com/Stage1/get-secrets",
      {
        method: "GET",
        headers: headers,
      }
    );
  
    if (!response.ok) {
      // render react component to show error
      throw new Error("Network response was not ok");
    }
  
    const data = await response.json();
    return data;
  }
  
  export { fetchSecrets };