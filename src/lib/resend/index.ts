import { Resend } from 'resend'
import type { Order } from '@/types'
import { formatNaira } from '@/lib/utils'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'orders@naronai.com'

export async function sendOrderStatusUpdate(
  email: string,
  orderId: string,
  newStatus: string,
) {
  const resend   = new Resend(process.env.RESEND_API_KEY)
  const orderRef = `#${orderId.slice(0, 8).toUpperCase()}`

  const statusLabels: Record<string, string> = {
    processing: 'Your order is being prepared',
    shipped:    'Your order is on its way',
    delivered:  'Your order has been delivered',
    cancelled:  'Your order has been cancelled',
  }

  const label = statusLabels[newStatus] ?? `Order status updated to ${newStatus}`

  await resend.emails.send({
    from:    `Naronai <${FROM}>`,
    to:      email,
    subject: `${label} — ${orderRef}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F2EC;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EC;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#2E1D1B;padding:32px;text-align:center;">
          <p style="margin:0;font-family:'Georgia',serif;font-size:22px;letter-spacing:0.25em;text-transform:uppercase;color:#F4ECE5;font-weight:300;">NARONAI</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:22px;color:#2E1D1B;">${label}</p>
          <p style="margin:16px 0 0;font-family:'Inter',sans-serif;font-size:14px;color:#5A443F;">Order ${orderRef}</p>
        </td></tr>
        <tr><td style="background:#2E1D1B;padding:20px;text-align:center;">
          <p style="margin:0;font-family:'Montserrat',sans-serif;font-size:10px;color:#8D6E74;letter-spacing:0.1em;">
            Questions? <a href="mailto:hello@naronai.com" style="color:#C3A05B;">hello@naronai.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}

export async function sendOrderConfirmation(order: Order, email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;font-family:'Georgia',serif;color:#2E1D1B;">${item.product.name}${item.selectedColor ? ` · ${item.selectedColor}` : ''}${item.selectedLength ? ` · ${item.selectedLength}` : ''}</td>
          <td style="padding:8px 0;text-align:center;color:#5A443F;">×${item.quantity}</td>
          <td style="padding:8px 0;text-align:right;color:#2E1D1B;">${formatNaira(item.product.price * item.quantity)}</td>
        </tr>`
    )
    .join('')

  await resend.emails.send({
    from:    `Naronai <${FROM}>`,
    to:      email,
    subject: `Order Confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F2EC;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2EC;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(46,29,27,0.08);">

        <!-- Header -->
        <tr><td style="background:#2E1D1B;padding:32px;text-align:center;">
          <p style="margin:0;font-family:'Georgia',serif;font-size:22px;letter-spacing:0.25em;text-transform:uppercase;color:#F4ECE5;font-weight:300;">NARONAI</p>
          <p style="margin:8px 0 0;font-family:'Inter',sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#D7B2A5;">Leave an Impression</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:24px;color:#2E1D1B;font-weight:400;">Thank you for your order</p>
          <p style="margin:0 0 24px;font-family:'Inter',sans-serif;font-size:14px;color:#5A443F;line-height:1.7;">
            Your order has been confirmed and is being prepared. We'll send you a tracking update once your parcel ships.
          </p>

          <!-- Order ref -->
          <div style="background:#F7F2EC;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
            <p style="margin:0;font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#B69E96;">Order Reference</p>
            <p style="margin:4px 0 0;font-family:'Georgia',serif;font-size:18px;color:#7A2F4B;">#${order.id.slice(0, 8).toUpperCase()}</p>
          </div>

          <!-- Items -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:0.5px solid #E5D2C6;border-bottom:0.5px solid #E5D2C6;margin-bottom:24px;">
            <tr>
              <th style="padding:10px 0;text-align:left;font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#B69E96;font-weight:500;">Item</th>
              <th style="padding:10px 0;text-align:center;font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#B69E96;font-weight:500;">Qty</th>
              <th style="padding:10px 0;text-align:right;font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#B69E96;font-weight:500;">Total</th>
            </tr>
            ${itemRows}
            <tr style="border-top:0.5px solid #E5D2C6;">
              <td colspan="2" style="padding:12px 0;font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#5A443F;font-weight:500;">Order Total</td>
              <td style="padding:12px 0;text-align:right;font-family:'Georgia',serif;font-size:18px;color:#C3A05B;">${formatNaira(order.total)}</td>
            </tr>
          </table>

          <!-- Shipping address -->
          <p style="margin:0 0 8px;font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#B69E96;">Shipping to</p>
          <p style="margin:0;font-family:'Inter',sans-serif;font-size:14px;color:#2E1D1B;line-height:1.7;">
            ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
            ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
            ${order.shippingAddress.phone}
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 40px 40px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${order.id}"
             style="display:inline-block;background:#7A2F4B;color:#F4ECE5;font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:2px;">
            View Order
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#2E1D1B;padding:24px;text-align:center;">
          <p style="margin:0;font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.1em;color:#8D6E74;">
            Questions? Reply to this email or contact us at <a href="mailto:hello@naronai.com" style="color:#C3A05B;">hello@naronai.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}
