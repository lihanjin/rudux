import React, { Component } from 'react';
import { List, Avatar, Button, Spin, Input } from 'antd';
import './App.css';
import { format } from 'util';
const { TextArea } = Input;
class App extends Component {
  constructor() {
    super()
    this.state = {
      profileList: [],
      userName: '',
      profile: ''
    }
    // this.comfirm = this.comfirm.bind(this)
  }
  componentWillMount() {
    let userName = localStorage.getItem('userName')
    let profileList = JSON.parse(localStorage.getItem('profile')) || []
    this.setState({
      profileList
    })
    try {
      if (userName) {
        this.setState({
          userName
        })
      }
    } catch (error) {

    }
  }
  componentDidMount() {
    this.textarea.focus()
  }
  confirm() {
    let profileList = this.state.profileList
    if (this.state.userName && this.state.profile) {
      console.log(profileList)
      profileList.unshift({ name: this.state.userName, profile: this.state.profile, time: new Date() })
      this.setState({
        profileList
      })
      this._saveProfileList(profileList)
    } else {
    }

  }
  userNameChange(event) {
    this.setState({
      userName: event.target.value
    })
  }
  profileChange(event) {
    this.setState({
      profile: event.target.value
    })
  }
  _saveUsername(userName) {
    localStorage.setItem('userName', userName)
  }
  handheldUserBlur(e) {
    this._saveUsername(e.target.value)
  }
  _saveProfileList(profile) {
    localStorage.setItem('profile', JSON.stringify(profile))
  }
  render() {
    return (
      <div className="todo">
        用户名：<TextArea placeholder="" autosize value={this.state.userName} onChange={this.userNameChange.bind(this)} onBlur={this.handheldUserBlur.bind(this)} />
        <div style={{ margin: '24px 0' }} />
        评论内容：<TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} value={this.state.profile} onChange={this.profileChange.bind(this)} ref={(textarea) => this.textarea = textarea} />
        <Buttons confirm={() => { this.confirm() }}></Buttons>
        <div style={{ margin: '24px 0' }} />
        <LoadMoreList results={this.state.profileList}></LoadMoreList>
        {/* <PercentageApp></PercentageApp> */}
      </div>
    );
  }
}


class InputS extends Component {
  constructor() {
    super()
    this.state = {
      num: 0
    }
  }
  handheld(event) {
    this.setState({
      num: event.target.value
    })
    if (this.props.onSub) {
      this.props.onSub(event.target.value)
    }
  }
  render() {
    return (
      <div>
        <input value={this.props.num} onChange={this.handheld.bind(this)} />
      </div>
    )
  }
}

class PercentageShower extends Component {
  render() {
    return (
      <div>{(this.props.num * 100).toFixed(2) + '%'}</div>
    )
  }
}

class PercentageApp extends Component {
  constructor() {
    super()
    this.state = {
      num: 0
    }
  }
  change(num) {
    this.setState({
      num
    })
  }
  render() {
    return (
      <div>
        <InputS num={this.state.num} onSub={this.change.bind(this)}></InputS>
        <PercentageShower num={this.state.num}></PercentageShower>
      </div>
    )
  }
}




class Buttons extends Component {
  render() {
    return (
      <div className="priarm" onClick={this.props.confirm}>
        提交
      </div>
    )
  }
}


class LoadMoreList extends React.Component {
  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: false,
    data: [],
    _time: ''
  }
  componentWillMount() {
    this.getData((res) => {
      this.setState({
        loading: false,
        data: res.results,
      });
      console.log(res.results)
    });
  }
  getData = (callback) => {
    // reqwest({
    //   url: fakeDataUrl,
    //   type: 'json',
    //   method: 'get',
    //   contentType: 'application/json',
    //   success: (res) => {
    //     callback(res);
    //   },
    // });
    console.log(this.props)
    callback(this.props)
  }
  componentWillUnmount() {
    clearInterval(this._time)
  }
  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });
    this.getData((res) => {
      const data = this.state.data.concat(res.results);
      this.setState({
        data,
        loadingMore: true,
      }, () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
    });
  }
  formatTime(time,key) {
    let str
    let durations = (+Date.now() - new Date(time).valueOf()) / 1000
    str= durations > 60
        ? `${Math.round(durations / 60)}分钟前`
        : `${Math.round(Math.max(durations, 1))}秒前`
        let data = this.state.data
        data[key].time = str
        console.log(this.state.data)
    this.setState({
      data
    })
    // this._time = setInterval(() => {
    //   str= durations > 60
    //   ? `${Math.round(durations / 60)}分钟前`
    //   : `${Math.round(Math.max(durations, 1))}秒前`
    // }, 6000)
  }
  formatTimeInterval(time) {

  }
  render() {
    const { loading, loadingMore, showLoadingMore, data } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && <Button onClick={this.onLoadMore}>loading more</Button>}
      </div>
    ) : null;
    return (
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={data}
        renderItem={(item,key) => (
          <List.Item actions={[<a>edit</a>, <a>more</a>]}>
            <List.Item.Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={<a href="https://ant.design">{item.name}</a>}
              description={item.profile}
            />
            <div>{this.formatTime(item.time,key)}</div>
          </List.Item>
        )}
      />
    );
  }
}

export default App;
