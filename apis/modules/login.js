import MinRequest from '../../MinRequest'
const minRequest = new MinRequest()

const apis = {
	login (data) {
	  return minRequest.get('/s', data)
	}
}

export default apis