import request from '@/utils/request'

// 查询域名记录列表
export function listDnsDomainNameRecord(query) {
  return request({
    url: '/platform/dnsDomainNameRecord/list',
    method: 'get',
    params: query
  })
}

// 查询域名记录详细
export function getDnsDomainNameRecord(id) {
  return request({
    url: '/platform/dnsDomainNameRecord/' + id,
    method: 'get'
  })
}

// 新增域名记录
export function addDnsDomainNameRecord(data) {
  return request({
    url: '/platform/dnsDomainNameRecord',
    method: 'post',
    data: data
  })
}

// 修改域名记录
export function updateDnsDomainNameRecord(data) {
  return request({
    url: '/platform/dnsDomainNameRecord',
    method: 'put',
    data: data
  })
}

// 删除域名记录
export function delDnsDomainNameRecord(id) {
  return request({
    url: '/platform/dnsDomainNameRecord/' + id,
    method: 'delete'
  })
}
