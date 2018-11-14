// import { observable, computed, flow } from 'mobx'
import { observable, computed, action } from 'mobx'
import initStore from 'utils/initStore'
// import testService from 'services/testService'

class TestStore {
  @observable
  test = {}

  @observable
  select = false

  @observable
  state = 'pending'

  @computed
  get username() {
    return this.userData.firstName + this.userData.lastName || ''
  }

  @action
  changeSelect() {
    this.select = !this.select
  }

  // fetchUserData = flow(function *() {
  //   try {
  //     this.userData = yield testService.fetchServUserData()
  //     this.state = 'done'
  //   } catch (error) {
  //     this.state = 'error'
  //   }
  // })
}

const clientState = new TestStore()

export default initStore(clientState)
