# Soulforge

Bảng Soul Binding cho Gladiator trong AION 2, viết bằng React và TypeScript. Bản này chuyển nguyên dữ liệu và chức năng từ bản HTML đã chốt ngày 31/10/2026; việc migration không phải một lần xác minh lại cơ chế game.

- DPS Soul Binding: 17 slot, 11 cột chỉ số, màu tier và nút ẩn dấu X.
- Danh sách đồ: mỗi món là một card, hai card mỗi hàng trên desktop (Greatsword/Guard, Helmet/Pauldrons, Chest/Belt...). Header chứa tên slot; nội dung chia hai cột tấn công và phòng thủ. Màn hình hẹp chuyển thành một card mỗi hàng.
- Chỉ hiển thị dòng %, với bốn hàng theo màu: S+ (độc quyền và các dòng vàng đã chọn), S (tấn công), A+ (phòng thủ), PVP (Effect, Resist và các dòng khắc chế chuyên PVP). Dòng độc quyền có chữ Unique màu cam trong thẻ; dấu tích riêng cho Earring 1/2 và Ring 1/2.
- Belt và Amulet giữ các ô chỉ số trống. Ring và Bracelet không có dòng % trong pool đã đối chiếu nên cũng để trống ở danh sách đồ; tab Bracelet vẫn giữ riêng.
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

Endurance ở Helmet, Legs và Cloak là dòng %; dấu tích của tên Endurance cũ được chuyển sang Endurance %. Các dấu tích flat khác vẫn nằm trong localStorage nhưng không hiển thị ở danh sách đồ. Mỗi chỉ số chỉ hiển thị một lần trên mỗi món đồ và giữ nguyên khóa dấu tích.

localStorage tách biệt theo origin. File HTML, localhost, 127.0.0.1, các port và domain khác nhau không chia sẻ tiến độ. Muốn chuyển dấu tích, đọc hai khóa trên bằng DevTools ở bản cũ, rồi dùng localStorage.setItem với đúng dữ liệu tại origin mới và tải lại. Không đưa tiến độ cá nhân vào Git.

## Template và nguồn

Khởi tạo từ [neikop/vite-2026](https://github.com/neikop/vite-2026), commit 7f9d385e3d7d8262c2b56a8be8473abc3ef90652. Repo có lịch sử Git riêng, không kế thừa commit của template.

HTML nguồn: AION2_Gladiator_Soul_Binding_BIS_Matrix.html, bản chốt tại Documents/Codex/2026-10-30/k/outputs/. Dữ liệu được trích sang TypeScript tại thời điểm migration, không nạp HTML khi chạy. Bản HTML gốc vẫn được giữ nguyên ở vị trí cũ.

React 19, Vite 8, TypeScript 6, Chakra UI 3, React Router và các provider dùng từ template. Không cần API hoặc tài khoản để sử dụng checklist.

Pool % trong danh sách đồ được rà lại ngày 31/10/2026 theo [Aion2.gg Soul Binding](https://aion2.gg/tools/soul-imprint) và bảng Range của từng slot (EU/NA client 2.0.9.0, dữ liệu trích ngày 28/10/2026). Bảy slot giáp có 7 dòng % mỗi slot, Weapons/Guard có 5, Necklace/Earrings có 1, Ring/Bracelet không có. Belt/Amulet vẫn là dòng trống theo bố cục người dùng yêu cầu.

Phân nhóm S+/S/A+ thể hiện cách hiển thị người dùng chọn, không phải tier được nguồn xác nhận. Hàng 4 gồm Status Effect Chance/Resist, Endurance Penetration, Perfect Resist, Double Resist, Multi-hit Resist và Weapon Damage Tolerance. Đây là cách nhóm theo ưu tiên PVP, không khẳng định các cơ chế chỉ hoạt động trong PVP. Critical Damage Tolerance là dòng độc quyền nên vẫn ở hàng S+ theo yêu cầu, dù ưu tiên PVP: [hướng dẫn thử nghiệm của Kanon](https://aion2simple.wiki/articles/damage-tolerance-endurance-and-combat-speed/) báo cáo boss không có Critical Hit, Weapon Damage Boost và Multi-hit. Endurance Penetration, Perfect Resist và Double Resist chưa có bằng chứng đủ để ưu tiên khi đánh boss. DPS matrix và tab Bracelet vẫn giữ dữ liệu đánh giá trước lần rà pool này.
