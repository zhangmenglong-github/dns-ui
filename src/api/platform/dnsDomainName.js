import request from '@/utils/request'

// 查询域名统计数量
export function listDnsDomainNameStatisticsCount(query) {
  return request({
    url: '/platform/dnsDomainName/list/statistics/count',
    method: 'get',
    params: query
  })
}

// 查询正常状态域名列表
export function listDnsDomainNameNormal(query) {
  return request({
    url: '/platform/dnsDomainName/list/normal',
    method: 'get',
    params: query
  })
}

// 获取域名统计信息
export function dnsDomainNameStatistics(query) {
  return request({
    url: '/platform/dnsDomainName/statistics',
    method: 'get',
    params: query
  })
}

// 获取域名查询地理位置统计信息
export function dnsDomainNameStatisticsQueryGeo(query) {
  return request({
    url: '/platform/dnsDomainName/statistics/geo',
    method: 'get',
    params: query
  })
}

// 获取域名子域统计信息
export function dnsDomainNameStatisticsQueryName(query) {
  return request({
    url: '/platform/dnsDomainName/statistics/query/name',
    method: 'get',
    params: query
  })
}

// 获取域名解析类型统计信息
export function dnsDomainNameStatisticsQueryType(query) {
  return request({
    url: '/platform/dnsDomainName/statistics/query/type',
    method: 'get',
    params: query
  })
}

// 获取域名子域解析类型统计信息
export function dnsDomainNameStatisticsQueryNameType(query) {
  return request({
    url: '/platform/dnsDomainName/statistics/query/name/type',
    method: 'get',
    params: query
  })
}

// 查询域名列表
export function listDnsDomainName(query) {
  return request({
    url: '/platform/dnsDomainName/list',
    method: 'get',
    params: query
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

// 刷新验证域名
export function validateRefreshDnsDomainName(data) {
  return request({
    url: '/platform/dnsDomainName/validate/refresh',
    method: 'put',
    data: data
  })
}

// 验证域名
export function validateDnsDomainName(data) {
  return request({
    url: '/platform/dnsDomainName/validate',
    method: 'put',
    data: data
  })
}

// 修改域名
export function updateDnsDomainNameDnssec(data) {
  return request({
    url: '/platform/dnsDomainName/dnssec',
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
