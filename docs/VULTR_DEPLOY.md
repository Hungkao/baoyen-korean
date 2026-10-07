# Deploy tự động lên Vultr

Repo: https://github.com/Hungkao/baoyen-korean. Website: https://baoyen.hcao.site.

Push vào `main` chạy format, lint, kiểm thử Playwright, build bằng Vite và tải riêng nội dung `dist` lên `/var/www/bao-yen` trên `45.76.155.252`. Pull request chỉ kiểm thử. Workflow không sửa Nginx hay restart server. Giọng đọc và safe-area trên điện thoại thật vẫn cần nghiệm thu riêng.

## Thiết lập VPS một lần

Tạo khóa riêng cho GitHub Actions trên máy Windows, không dùng khóa root và không commit private key. Trong PowerShell tại thư mục project:

```powershell
New-Item -ItemType Directory -Force .deploy | Out-Null
if (-not (Test-Path .deploy/vultr_actions)) {
    $PSNativeCommandArgumentPassing = 'Standard'
    ssh-keygen -t ed25519 -C 'baoyen-github-actions' -f .deploy/vultr_actions -N ''
}
```

Lệnh tạo khóa dùng PowerShell 7 và để passphrase trống để workflow chạy không tương tác. Nếu đã có khóa do Codex tạo, giữ nguyên khóa đó để khớp GitHub Secret. `.deploy` đã được gitignore. Xem public key:

```powershell
Get-Content .deploy/vultr_actions.pub
```

Trong phiên SSH root trên VPS, chạy:

```bash
apt update && apt install -y rsync
id deploy >/dev/null 2>&1 || adduser --disabled-password --gecos '' deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
mkdir -p /var/www/bao-yen
chown -R deploy:deploy /var/www/bao-yen
chmod 755 /var/www/bao-yen
```

Thêm nguyên public key vừa tạo (dòng `ssh-ed25519 ...`) vào `/home/deploy/.ssh/authorized_keys`, rồi chạy:

```bash
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
```

Tài khoản `deploy` không cần quyền sudo. Giữ cấu hình Nginx với `root /var/www/bao-yen` và `server_name baoyen.hcao.site`.

## GitHub Actions secrets

Trong repo, vào Settings → Secrets and variables → Actions → New repository secret:

- `VPS_SSH_KEY`: toàn bộ nội dung file `.deploy/vultr_actions`, gồm dòng BEGIN/END. Chỉ dán vào GitHub Secrets, không vào chat hoặc repo.
- `VPS_KNOWN_HOSTS`: host key của VPS đã được xác minh.

Lấy fingerprint trên VPS trong phiên SSH đáng tin cậy:

```bash
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Trên Windows, quét host key và đối chiếu fingerprint trước khi lưu vào secret:

```powershell
ssh-keyscan -t ed25519 45.76.155.252 | Set-Content .deploy/known_hosts -Encoding ascii
ssh-keygen -lf .deploy/known_hosts
Get-Content .deploy/known_hosts
```

Hai fingerprint phải giống nhau. Không tắt kiểm tra host key trong workflow. Kiểm tra quyền trước khi chạy workflow:

```powershell
ssh -i .deploy/vultr_actions -o BatchMode=yes deploy@45.76.155.252 'test -w /var/www/bao-yen && command -v rsync'
```

Sau khi có hai secret, vào Actions → Test and deploy to Vultr → Run workflow, chọn `main`. Các push tiếp theo tự deploy sau khi kiểm thử đạt. Xem cả job `test` và `deploy`; có workflow chưa đồng nghĩa website đã được cập nhật.

Workflow dùng `rsync --delay-updates` để tránh ghi đè từng file đang tải, nhưng đây không phải chuyển toàn bộ phiên bản một cách nguyên tử. Nếu cần rollback, revert commit rồi push lại; dữ liệu học trên trình duyệt không bị thay đổi. Nút cập nhật PWA áp dụng worker mới sau khi tăng cache version trong `sw.js`.
