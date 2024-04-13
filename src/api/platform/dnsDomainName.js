import request from '@/utils/request'

// 查询域名列表
export function listDnsDomainName(query) {
  return request({
    url: '/platform/dnsDomainName/list',
    method: 'get',
    params: query
  })
}

// 查询域名详细
export function getDnsDomainName(id) {
  return request({
    url: '/platform/dnsDomainName/' + id,
    method: 'get'
  })
}

// 新增域名
export function addDnsDomainName(data) {
  return request({
    url: '/platform/dnsDomainName',
    method: 'post',
    data: data
  })
}

// 修改域名
export function updateDnsDomainName(data) {
  return request({
    url: '/platform/dnsDomainName',
    method: 'put',
    data: data
  })
}

// 删除域名
export function delDnsDomainName(id) {
  return request({
    url: '/platform/dnsDomainName/' + id,
    method: 'delete'
  })
}
