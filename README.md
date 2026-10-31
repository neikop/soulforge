# Soulforge

Bảng Soul Binding cho Gladiator trong AION 2, viết bằng React và TypeScript. Bản này chuyển nguyên dữ liệu và chức năng từ bản HTML đã chốt ngày 31/10/2026; việc migration không phải một lần xác minh lại cơ chế game.

- DPS Soul Binding: 17 slot, 11 cột chỉ số, màu tier; các ô không có chỉ số luôn để trống.
- Danh sách đồ: mỗi món là một card, hai card mỗi hàng trên desktop (Greatsword/Guard, Helmet/Pauldrons, Chest/Belt...). Header chứa tên slot; nội dung chia hai cột tấn công và phòng thủ. Màn hình hẹp chuyển thành một card mỗi hàng.
- Giáp/vũ khí chỉ hiển thị dòng %. Earrings, Necklace và Rings hiển thị đủ pool chỉ số, kể cả dòng flat ở tier A; Move Speed % trên Earrings và Combat Speed % trên Necklace ở tier S. Ring 1/2 ưu tiên Overhead Slam +1, Rending Blow +1 và Ruinous Blow +1 ở hàng S+ tấn công, có dấu tích riêng từng nhẫn.
- Bốn nhóm gồm S+ (độc quyền và các dòng vàng đã chọn), tấn công, phòng thủ, PVP (Effect, Resist và các dòng khắc chế chuyên PVP). Dòng độc quyền có chữ Unique màu cam trong thẻ; dấu tích riêng cho Earring 1/2 và Ring 1/2.
- Belt, Amulet và Bracelet giữ các ô chỉ số trống; tab Bracelet vẫn giữ riêng. Card trống vẫn có phần content hai cột và một hàng trống tối thiểu 24px.
- Tìm slot/chỉ số, đặt lại bộ lọc, lưu tab và tiến độ bằng localStorage.
- /components giữ hướng dẫn component của template và ví dụ màu matrix.

## Chạy local

Yêu cầu Node.js 22.x và pnpm 8.9.2 (được khai báo trong packageManager).

```sh
pnpm install
pnpm dev
```

Vite phục vụ tại http://localhost:3008. Giao diện mặc định tối; trang component guide vẫn có nút đổi light/dark. Bảng rộng cuộn ngang bên trong container khi dùng màn hình nhỏ.

```sh
pnpm chakra-typegen
pnpm check
pnpm test:matrix
pnpm preview
```

pnpm check chạy format, lint, contrast, TypeScript và production build. Hook pre-commit chạy cùng gate. Không chỉnh lockfile hoặc output typegen bằng tay.

## Deploy trên Vercel

Project Vercel dùng Git integration với repo [neikop/soulforge](https://github.com/neikop/soulforge). Cấu hình production branch là `main`: mỗi lần push lên `main`, Vercel tự build và deploy Production; các branch/PR đủ điều kiện tạo Preview.

Production: [soulforge-eta.vercel.app](https://soulforge-eta.vercel.app). Project `soulforge` thuộc team `neikops-projects`, dùng Node.js 22.x giống môi trường local đã kiểm tra.

`vercel.json` cố định pnpm 8.9.2, build bằng `pnpm run build` và xuất `dist`. SPA fallback hỗ trợ truy cập trực tiếp hoặc tải lại `/components`, đồng thời giữ riêng request assets và API. Ứng dụng hiện không cần biến môi trường để dùng matrix và checklist.

Sau khi Git integration được kết nối, các lần cập nhật chỉ cần commit và `git push`; không cần chạy lệnh deploy thủ công. Thư mục `.vercel/` chứa liên kết local và được bỏ qua trong Git.

## Nơi sửa tiếp

- src/views/Soulforge/data.ts: thứ tự slot, pool chỉ số, tier và nhóm dòng.
- src/views/Soulforge/: component, state, xử lý lưu tiến độ và style riêng.
- src/components/theme/matrix-palette.json và matrixTokens.ts: màu, typography của matrix.
- src/components/theme/: hạ tầng theme chung; DESIGN.md quy định ownership và coding style.

## Tiến độ trình duyệt

Hai khóa được giữ nguyên: aion2.gladiator.gear-owned.v1 và aion2.gladiator.active-tab.v1. Dữ liệu cũ có earrings|... và rings|... được chuyển sang slot 1; slot 2 độc lập. Tên Attack/Defense increase cũ cũng được chuyển thành Increase mà giữ dấu tích.

Endurance ở Helmet, Legs và Cloak là dòng %; dấu tích của tên Endurance cũ được chuyển sang Endurance %. Các dấu tích flat vẫn nằm trong localStorage; nhóm phụ kiện hiển thị lại các dòng này với khóa cũ. Natural HP/MP Regen được viết đầy đủ thành Regeneration ở label mà giữ nguyên khóa. Mỗi chỉ số chỉ hiển thị một lần trên mỗi món đồ.

localStorage tách biệt theo origin. File HTML, localhost, 127.0.0.1, các port và domain khác nhau không chia sẻ tiến độ. Muốn chuyển dấu tích, đọc hai khóa trên bằng DevTools ở bản cũ, rồi dùng localStorage.setItem với đúng dữ liệu tại origin mới và tải lại. Không đưa tiến độ cá nhân vào Git.

## Template và nguồn

Khởi tạo từ [neikop/vite-2026](https://github.com/neikop/vite-2026), commit 7f9d385e3d7d8262c2b56a8be8473abc3ef90652. Repo có lịch sử Git riêng, không kế thừa commit của template.

HTML nguồn: AION2_Gladiator_Soul_Binding_BIS_Matrix.html, bản chốt tại Documents/Codex/2026-10-30/k/outputs/. Dữ liệu được trích sang TypeScript tại thời điểm migration, không nạp HTML khi chạy. Bản HTML gốc vẫn được giữ nguyên ở vị trí cũ.

React 19, Vite 8, TypeScript 6, Chakra UI 3, React Router và các provider dùng từ template. Không cần API hoặc tài khoản để sử dụng checklist.

Pool % trong danh sách đồ được rà lại ngày 31/10/2026 theo [Aion2.gg Soul Binding](https://aion2.gg/tools/soul-imprint) và bảng Range của từng slot (EU/NA client 2.0.9.0, dữ liệu trích ngày 28/10/2026). Bảy slot giáp có 7 dòng % mỗi slot, Weapons/Guard có 5, Necklace/Earrings có 1, Ring/Bracelet không có. Belt/Amulet vẫn là dòng trống theo bố cục người dùng yêu cầu.

Pool chỉ số phụ kiện được đối chiếu trên các trang [Earrings](https://aion2.gg/tools/soul-imprint/earring), [Necklace](https://aion2.gg/tools/soul-imprint/necklace) và [Ring](https://aion2.gg/tools/soul-imprint/ring): Earrings/Necklace có 16 dòng (1 dòng % và 15 dòng flat), Ring có 15 dòng flat. Các bảng này không liệt kê dòng tăng cấp kỹ năng. Intelligence đi cùng nhóm Effect ở hàng PVP; Critical Hit Resist và Evasion ở phía phòng thủ của hàng đó. Các dòng flat giữ tier A dù nằm trong nhóm tấn công, phòng thủ hay PVP.

Ring còn roll dòng tăng cấp kỹ năng chủ động theo [LUM.GG](https://lum.gg/aion-2/guides/soul-binding-guide) và pool kỹ năng Gladiator +1 trên [Abyssal Ring](https://aion2data.com/items/310330095-abyssal-ring). Danh sách đồ bổ sung ba dòng ưu tiên Overhead Slam +1, Rending Blow +1, Ruinous Blow +1 theo [hướng dẫn Gladiator](https://aion2-meta.com/guides/gladiator/), xếp S+ theo cách hiển thị đã chọn. Đây là ba kỹ năng khuyến nghị, không phải toàn bộ pool kỹ năng Ring; không gắn Unique vì dòng tăng cấp kỹ năng chủ động cũng có trên vũ khí.

Phân nhóm S+/S/A+/A thể hiện cách hiển thị người dùng chọn, không phải tier được nguồn xác nhận. Hàng 4 còn gồm Status Effect Chance/Resist, Endurance Penetration, Perfect Resist, Double Resist, Multi-hit Resist và Weapon Damage Tolerance. Đây là cách nhóm theo ưu tiên PVP, không khẳng định các cơ chế chỉ hoạt động trong PVP. Critical Damage Tolerance là dòng độc quyền nên vẫn ở hàng S+ theo yêu cầu, dù ưu tiên PVP: [hướng dẫn thử nghiệm của Kanon](https://aion2simple.wiki/articles/damage-tolerance-endurance-and-combat-speed/) báo cáo boss không có Critical Hit, Weapon Damage Boost và Multi-hit. Endurance Penetration, Perfect Resist và Double Resist chưa có bằng chứng đủ để ưu tiên khi đánh boss. DPS matrix đồng bộ tier S cho tốc độ trên Earrings/Necklace; các ô khác và tab Bracelet giữ dữ liệu đánh giá trước lần rà pool này.
