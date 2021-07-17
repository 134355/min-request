import MinRequest from '../../MinRequest'
const minRequest = new MinRequest()

const apis = {
	uniapp (data) {
	  return minRequest.get('/s', data)
	}
}

export default apis