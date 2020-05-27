import React from 'react'
import get from 'lodash/get'
import dayjs from 'dayjs'

import { useStateValue } from 'data/state'

import Paginate from 'components/Paginate'
import Link from 'components/Link'

const AdminShops = () => {
  const [{ admin }] = useStateValue()

  const shops = get(admin, 'shops', [])

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Shops</h3>
        <Link to="/super-admin/shops/new" className="btn btn-primary">
          Create shop
        </Link>
      </div>
      <table className="table admin-discounts">
        <thead>
          <tr>
            <th>Name</th>
            <th>Listing ID</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr
              key={shop.id}
              // onClick={() => {
              //   history.push(`/admin/super-admin/shops/${shop.id}`)
              // }}
            >
              <td>{shop.name}</td>
              <td>{shop.listingId}</td>
              <td>{dayjs(shop.createdAt).format('MMM D, h:mm A')}</td>
              <td className="text-right">
                {!shop.viewable ? null : (
                  <>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        sessionStorage.dataDir = shop.authToken
                        window.open(location.origin)
                      }}
                      children="Storefront"
                    />
                    <span className="mx-2" style={{ color: '#999' }}>
                      |
                    </span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        sessionStorage.dataDir = shop.authToken
                        window.open(
                          `${location.origin}/#/admin/settings/server`
                        )
                      }}
                      children="Admin"
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paginate total={shops.length} />
    </>
  )
}

export default AdminShops